import { UserData } from '@/lib/types';
import { checkEnvironment } from '@/lib/utils'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { baseUrl } = checkEnvironment();
  const users = await fetch(`${baseUrl}/api/users`).then((res) => res.json());
  console.log("\n\n\n");
  console.log(users);
  const usernamesEntries = users.users.map((user: UserData) => ({
    url: `${baseUrl}/users/${user.username}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
  }))
  return [
    {
      url: `${baseUrl}/login`
    },
    {
      url: `${baseUrl}/signup`
    },
    ...usernamesEntries]
}