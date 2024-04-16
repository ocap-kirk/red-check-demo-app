// pages/api/companies/[companyId]/accounts/[accountId]/users/[userId].js
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
    const { companyId, accountId, userId } = req.query;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error accessing data' });
        }
        const jsonData = JSON.parse(data);
        const company = jsonData.companies.find(c => c.companyId === companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        const account = company.accounts.find(a => a.accountId === accountId);
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        const user = account.users.find(u => u.userId === userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        switch (req.method) {
            case 'GET':
                res.status(200).json(user);
                break;
            case 'PUT':
                Object.assign(user, req.body);
                fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), err => {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating data' });
                    }
                    res.status(200).json(user);
                });
                break;
            case 'DELETE':
                account.users = account.users.filter(u => u.userId !== userId);
                fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), err => {
                    if (err) {
                        return res.status(500).json({ message: 'Error deleting data' });
                    }
                    res.status(204).send();
                });
                break;
            default:
                res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
