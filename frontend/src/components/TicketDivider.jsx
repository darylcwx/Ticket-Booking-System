import { eventImageHeightAndWidth } from "../constants/globalVars";
export default function TicketDivider() {
    return (
        <div className="w-4 flex flex-col items-center justify-center transform -translate-x-1/2">
            <div className="w-5 h-3 overflow-hidden">
                <div className="h-full bg-ticketDivider rounded-b-full"></div>
            </div>
            <div
                className="border-l-4 border-dashed border-ticketDivider grow"
                style={{
                    height: { eventImageHeightAndWidth },
                }}
            />
            <div className="w-5 h-3 overflow-hidden">
                <div className="h-full bg-ticketDivider rounded-t-full"></div>
            </div>
        </div>
    );
}
