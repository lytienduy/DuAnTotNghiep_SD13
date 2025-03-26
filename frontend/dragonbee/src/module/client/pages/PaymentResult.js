import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from 'axios';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_TxnRef = searchParams.get("vnp_TxnRef");
    const vnp_Amount = searchParams.get("vnp_Amount");


    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (vnp_ResponseCode === "00") {
            const response = axios.get(`http://localhost:8080/payment/vn-pay-callback`
                , {
                    params: {
                        vnp_ResponseCode: vnp_ResponseCode,
                        vnp_TxnRef: vnp_TxnRef,
                        vnp_Amount: vnp_Amount,
                    }
                }
            );
            setMessage(`Đơn hàng ${vnp_TxnRef} đã được thanh toán thành công!`);
            setStatus("success");
        } else {
            setMessage(`Thanh toán thất bại! Mã lỗi: ${vnp_ResponseCode}`);
            setStatus("error");
        }
        // ✅ Tự động đóng tab sau 5 giây
        const timer = setTimeout(() => {
            window.close(); // Đóng tab
        }, 5000);

        return () => clearTimeout(timer);
    }, [vnp_ResponseCode, vnp_TxnRef]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className={`p-6 rounded-lg shadow-lg ${status === "success" ? "bg-green-200" : "bg-red-200"}`}>
                <h2 className="text-2xl font-bold">{status === "success" ? "Thanh toán thành công!" : "Thanh toán thất bại!"}</h2>
                <p className="mt-2">{message}</p>
                <p className="mt-2">Tab này sẽ tự động đóng sau 5 giây...</p>
            </div>
        </div>
    );
};

export default PaymentResult;
