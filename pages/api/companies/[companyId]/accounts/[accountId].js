// pages/api/companies/[companyId]/accounts/[accountId].js
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
                res.status(200).json(account);
                break;
            case 'PUT':
                Object.assign(account, req.body);
                fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), err => {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating data' });
                    }
                    res.status(200).json(account);
                });
                break;
            case 'DELETE':
                company.accounts = company.accounts.filter(a => a.accountId !== accountId);
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
