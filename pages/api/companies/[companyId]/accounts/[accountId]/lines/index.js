// pages/api/companies/[companyId]/accounts/[accountId]/lines/index.js
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
        const company = jsonData.companies.find(c => c.id === companyId);
        const account = company && company.accounts.find(a => a.id === accountId);

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        switch (req.method) {
            case 'GET':
                res.status(200).json(account.lines || []);
                break;
            case 'POST':
                const newLine = { id: account.lines.length + 1, ...req.body };
                account.lines.push(newLine);
                fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), err => {
                    if (err) {
                        return res.status(500).json({ message: 'Error saving data' });
                    }
                    res.status(201).json(newLine);
                });
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
