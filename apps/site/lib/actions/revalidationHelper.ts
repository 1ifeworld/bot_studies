'use server'

import { revalidatePath } from 'next/cache'

export async function revalidationHelper(
  path: string,
  type?: 'page' | 'layout',
) {
  revalidatePath(path, type)
}
