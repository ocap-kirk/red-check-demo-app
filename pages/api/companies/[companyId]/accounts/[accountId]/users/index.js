// pages/api/companies/[companyId]/accounts/[accountId]/users/index.js
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
    const { companyId, accountId } = req.query;

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

        switch (req.method) {
            case 'GET':
                res.status(200).json(account.users || []);
                break;
            case 'POST':
                const newUser = {
                    userId: (account.users.length > 0 ? Math.max(...account.users.map(user => parseInt(user.userId))) + 1 : 1),
                    ...req.body
                };
                account.users.push(newUser);
                fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), err => {
                    if (err) {
                        return res.status(500).json({ message: 'Error saving data' });
                    }
                    res.status(201).json(newUser);
                });
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
