"use server";
import { cookies } from "next/headers";
import { createAdminClient, createSessionClient } from "../appwrite";
import { ID, Query } from "node-appwrite";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
  PLAID_PRODUCTS,
} = process.env;

export const getUserInfo = async ({userId} : getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();
    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
}

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    const user = await getUserInfo({userId: session.userId})
    return parseStringify(user);
  } catch (error) {
    console.error("Error: ", error);
  }
};

export const signUp = async ({password, ...userData}: SignUpParams) => {
  const { email, firstName, lastName } = userData;
  let newUserAccount;
  try {
    const { account, database } = await createAdminClient();
    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    if (!newUserAccount) throw Error("Error creating user");
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });
    if (!dwollaCustomerUrl) throw Error("Error creating Dwolla customer");

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    );
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error: ", error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result =  await account.get();
    const user = await getUserInfo({userId: result.$id})
    return user;
  } catch (error) {
    return null;
  }
}

export const logout = async () => {
  try {
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");
    await account.deleteSession("current");
    return true;
  } catch (error) {
    return null;
  }
};

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: PLAID_PRODUCTS?.split(",") as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  fundingSourceUrl,
  shareableId,
  accessToken
}: createBankAccountProps) => {
  const { database } = await createAdminClient();
  const bankAccount = await database.createDocument(
    DATABASE_ID!,
    BANK_COLLECTION_ID!,
    ID.unique(),
    {
      userId,
      bankId,
      accountId,
      accessToken,
      fundingSourceUrl,
      shareableId,
    }
  );
  // console.log({ Bank:  bankAccount });
  return parseStringify(bankAccount);
};

export const exchangePublicToken = async ({
  user,
  publicToken,
}: exchangePublicTokenProps) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    // console.log("Step 1")
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    
    const accountResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    // console.log("Step 2")
    
    const accountData = accountResponse.data.accounts[0];
    
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };
    
    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    // console.log("Step 3")
    const processorToken = processorTokenResponse.data.processor_token;
    
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });
    // console.log("Step 4")
    
    if (!fundingSourceUrl) throw Error;
    // console.log("Step 5")
    await createBankAccount({
      accessToken,
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });
    // console.log("Step 6")
    revalidatePath("/");

    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.log(error);
  }
};

//BUG ---- Banks are not being stored in appwrite database -- Fixed
export const getBanks = async ({userId} : getBanksProps) => {
  try {
    const { database } = await createAdminClient();
    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error);
  }
}

export const getBank = async ({documentId} : getBankProps) => {
  // console.log({documentId})
  try {
    const { database } = await createAdminClient();
    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', [documentId])]
    );
    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
}

export const getBankByAccountId = async ({accountId} : getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();
    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    );
    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
}