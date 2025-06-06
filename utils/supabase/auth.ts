"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";
const supabase = await createClient();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// export async function login(email: string, password: string, path?: string) {
//   const data = {
//     email,
//     password,
//   }

//   const { error } = await supabase.auth.signInWithPassword(data)

//   if (error) {
//     console.log(error)
//     throw new Error('エラーが発生しました')
//     // redirect('/error')
//   }

// //   await validateUser();
//   revalidatePath('/', 'layout')
//   redirect(`/${path || "home"}`)
// }

export async function signout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
    throw new Error("エラーが発生しました");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function validateUser() {
  const { data, error }: any = await supabase.auth.getUser();
  if (error || !data?.user) redirect("/login");
  const userData: any = data.user;

  const userAccess: any = await prisma.userAccess.findUnique({
    where: { user_id: userData.id },
  });
  if (!userAccess) redirect("/login");

  console.log("User Access:", userAccess);

  return { ok: true, data: userAccess };
}

// export async function validateUserServer() {
//   const { data, error }: any = await supabase.auth.getUser();
//   if (error || !data?.user) {
//     return { ok: false, message: 'No user found.' }
//   }

//   const userData: any = data.user;
//   const memberData: any = await prisma.member.findUnique({
//     where: { uuid: userData.id },
//   });
//   if (!memberData) {
//     return { ok: false, message: 'No member found.' }
//   }

//   console.log('validate user (server):', memberData)
//   return { ok: true, userData, memberData }
// }

// export async function getValidationInfo(studentId: string, chuoEmail: string) {
//   const validationInfo: any = await prisma.validation.findUnique({
//     where: {
//       studentId,
//       chuoEmail,
//     }
//   });
//   if (!validationInfo) {
//     return { ok: false, message: 'Cannot find valid user. Student ID and Chuo Email might not match.' }
//   }

//   if (validationInfo.type == 1) {
//     return { ok: true, valid: validationInfo.valid, message: 'Valid user data for force signup.' }
//   }

//   return { ok: false, message: 'Not Authorized' }
// }
