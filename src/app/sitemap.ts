import { checkEnvironment } from '@/lib/utils';
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { baseUrl } = checkEnvironment();
    const usersRes = await fetch(`${baseUrl}/api/users`);
    const users = await usersRes.json();
    const userEntries: MetadataRoute.Sitemap = users.map((user: { username: string }) => ({
        url: `${baseUrl}/users/${user.username}`,
    }))
    return [...userEntries]
}
