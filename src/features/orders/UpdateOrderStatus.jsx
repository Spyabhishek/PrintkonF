import React, { useState } from "react";
import { operatorService } from "../../shared/services/operatorService";

export default function UpdateOrderStatus({ orderId }) {
    const [status, setStatus] = useState("in_progress");
    const update = async () => {
        await operatorService.updateOrderStatus(orderId, status); // POST /operator/orders/:id/status
        alert("Updated");
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 border rounded">
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
            </select>
            <button onClick={update} className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded">Update</button>
        </div>
    );
}
