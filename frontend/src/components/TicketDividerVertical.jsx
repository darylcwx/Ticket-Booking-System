export default function TicketDividerVertical({ className }) {
    return (
        <div
            className={`${className} w-4 flex flex-col items-center justify-center transform -translate-x-1/2`}
        >
            <div className="w-5 h-3">
                <div className="h-full bg-ticketDivider rounded-b-full" />
            </div>
            <div className="border-l-[3px] border-r-[3px] border-dashed border-ticketDivider grow" />
            <div className="w-5 h-3">
                <div className="h-full bg-ticketDivider rounded-t-full" />
            </div>
        </div>
    );
}
