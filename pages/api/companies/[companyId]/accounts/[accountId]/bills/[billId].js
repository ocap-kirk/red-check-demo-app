// pages/api/companies/[companyId]/accounts/[accountId]/bills/[billId].js
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
    const { companyId, accountId, billId } = req.query;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error accessing data' });
        }
        const jsonData = JSON.parse(data);
        const company = jsonData.companies.find(c => c.companyId === companyId);
        const account = company && company.accounts.find(a => a.accountId === accountId);
        const bill = account && account.bills.find(b => b.billId === billId);

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        switch (req.method) {
            case 'GET':
                res.status(200).json(bill);
                break;
            case 'PUT':
                Object.assign(bill, req.body);
                fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), err => {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating data' });
                    }
                    res.status(200).json(bill);
                });
                break;
            case 'DELETE':
                account.bills = account.bills.filter(b => b.billId !== billId);
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
