import React from "react";
import Card from "../../../shared/components/ui/Card";
import { adminService } from "../../../shared/services/adminService";

export default function AdminDashboard() {
    return (
        <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card title="Pending orders"><p>Count: ...</p></Card>
                <Card title="Assigned orders"><p>Count: ...</p></Card>
                <Card title="Operators"><p>Count: ...</p></Card>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-2">Quick actions</h3>
                <div className="flex gap-2">
                    <button className="px-3 py-2 bg-indigo-600 text-white rounded">View All Orders</button>
                    <button className="px-3 py-2 bg-white dark:bg-slate-800 rounded border">Operators</button>
                </div>
            </div>
        </div>
    );
}
