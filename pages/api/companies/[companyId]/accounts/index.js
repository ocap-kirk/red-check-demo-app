// pages/api/companies/[companyId]/accounts/index.js
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
    const { companyId } = req.query;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error accessing data' });
        }
        const jsonData = JSON.parse(data);
        const company = jsonData.companies.find(c => c.companyId === companyId);
        console.log(jsonData.companies);

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        switch (req.method) {
            case 'GET':
                res.status(200).json(company.accounts || []);
                break;
            case 'POST':
                const newAccount = {
                    id: (company.accounts.length > 0 ? Math.max(...company.accounts.map(acc => acc.accountId)) + 1 : 1), // Ensure unique ID
                    ...req.body
                };
                company.accounts.push(newAccount);
                fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), err => {
                    if (err) {
                        return res.status(500).json({ message: 'Error saving data' });
                    }
                    res.status(201).json(newAccount);
                });
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
