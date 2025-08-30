"use client";
import { postApi, getAPi } from "@/http/api";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function Appointment() {
    const [address, setAddress] = useState("");
    const [lastname, setLastname] = useState("");
    const [firstName, setFirstName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [doctor, setDoctor] = useState<string>("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const user =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "null")
            : null;

    // Həkimləri backend-dən çəkmək
    const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
        queryKey: ["doctors"],
        queryFn: async () => getAPi("/persons"), // /persons endpoint həkimləri qaytarmalıdır
    });

    const { mutate: createAppointment, isPending } = useMutation({
        mutationFn: async (data: any) => postApi("/appointments/create", data),
        onSuccess: () => {
            setSuccess(true);
            setError(null);
            // formu təmizləmək
            setFirstName("");
            setLastname("");
            setEmail("");
            setPhone("");
            setAddress("");
            setDoctor("");
            setDate("");
            setTime("");
        },
        onError: (err: any) => setError(err.message || "Something went wrong"),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !user._id) {
            setError("Zəhmət olmasa, əvvəlcə daxil olun.");
            return;
        }
        if (!doctor || !date || !time) {
            setError("Zəhmət olmasa həkimi, tarixi və vaxtı seçin.");
            return;
        }

        createAppointment({
            user: user._id,
            doctor,
            firstName,
            lastname,
            email,
            phone,
            address,
            date,
            time,
            status: "pending",
        });
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(false), 3000); // 3 saniyə sonra yox olacaq
            return () => clearTimeout(timer);
        }
    }, [success]);

    return (
        <div className="container mx-auto px-4 mt-23 py-8">
            {success && (
                <div className="p-4 bg-green-100 text-green-700 rounded mb-4">
                    Appointment successfully created!
                </div>
            )}
            <div className="flex flex-col justify-center items-center text-center">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h1 className="text-4xl uppercase font-semibold mb-4">
                        Book an Appointment
                    </h1>
                    <p className="text-[16px] text-[#565656] py-2.5">Diam volutpat commodo sed egestas egestas fringilla phasellus. Augue eget arcu dictum <br /> varius duis at consectetur lorem. Mauris nunc congue nisi vitae. </p>

                    <div className="grid gap-4 w-[100%] mb-6">
                        <input
                            type="text"
                            placeholder="First Name *"
                            className="w-full border px-3 py-4 focus:outline-none"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Last Name *"
                            className="w-full border px-3 py-4 focus:outline-none"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone *"
                            className="w-full border px-3 py-4 focus:outline-none"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email *"
                            className="w-full border px-3 py-4 focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {/* Həkim seçimi */}
                        <select
                            className="w-full border px-3 py-4 focus:outline-none"
                            value={doctor}
                            onChange={(e) => setDoctor(e.target.value)}
                            required
                            disabled={doctorsLoading}
                        >
                            <option value="">Select Doctor</option>
                            {doctorsData?.data?.map((doc: any) => (
                                <option key={doc._id} value={doc._id}>
                                    {doc.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            className="w-full border px-3 py-4 focus:outline-none"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                        <input
                            type="time"
                            className="w-full border px-3 py-4 focus:outline-none"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="text-red-600">{error}</div>}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-[#1c1c1c] hover:bg-black tracking-[1.95px] text-white text-[13px] font-medium px-12.5 py-5 uppercase"
                    >
                        {isPending ? "Processing..." : "Send Request"}
                    </button>
                </form>
            </div>
        </div>
    );
}
