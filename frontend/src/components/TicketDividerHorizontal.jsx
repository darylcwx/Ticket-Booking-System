export default function TicketDividerHorizontal({ className }) {
    return (
        <div
            className={`${className} w-full flex flex items-center justify-center transform -translate-y-1/2`}
        >
            <div className="w-3 h-5">
                <div className="h-full bg-ticketDivider rounded-r-full" />
            </div>
            <div className="border-b-[3px] border-t-[3px] border-dashed border-ticketDivider grow" />
            <div className="w-3 h-5">
                <div className="h-full bg-ticketDivider rounded-l-full" />
            </div>
        </div>
    );
}
