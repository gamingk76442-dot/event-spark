import { MapPin, Navigation, Users, MessageSquare } from "lucide-react";

interface BookingDetailsCardProps {
  notes: string | null;
}

interface ParsedDetails {
  pickup?: string;
  drop?: string;
  venue?: string;
  guests?: string;
  additionalNotes?: string;
}

const parseNotes = (notes: string | null): ParsedDetails => {
  if (!notes) return {};
  
  const parts = notes.split(" | ");
  const details: ParsedDetails = {};
  
  parts.forEach(part => {
    if (part.startsWith("Pickup: ")) {
      details.pickup = part.replace("Pickup: ", "");
    } else if (part.startsWith("Drop: ")) {
      details.drop = part.replace("Drop: ", "");
    } else if (part.startsWith("Venue: ")) {
      details.venue = part.replace("Venue: ", "");
    } else if (part.startsWith("Guests: ")) {
      details.guests = part.replace("Guests: ", "");
    } else if (part.startsWith("Notes: ")) {
      details.additionalNotes = part.replace("Notes: ", "");
    } else {
      // Legacy notes without prefix
      if (!details.additionalNotes) {
        details.additionalNotes = part;
      } else {
        details.additionalNotes += "; " + part;
      }
    }
  });
  
  return details;
};

const BookingDetailsCard = ({ notes }: BookingDetailsCardProps) => {
  const details = parseNotes(notes);
  const hasDetails = Object.keys(details).length > 0;

  if (!hasDetails) {
    return <span className="text-muted-foreground text-sm">-</span>;
  }

  return (
    <div className="space-y-2 text-sm">
      {/* Driving Details */}
      {(details.pickup || details.drop) && (
        <div className="bg-secondary/50 rounded-lg p-2 space-y-1">
          {details.pickup && (
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-green-600 mt-0.5 shrink-0" />
              <span><strong>From:</strong> {details.pickup}</span>
            </div>
          )}
          {details.drop && (
            <div className="flex items-start gap-2">
              <Navigation size={14} className="text-destructive mt-0.5 shrink-0" />
              <span><strong>To:</strong> {details.drop}</span>
            </div>
          )}
        </div>
      )}

      {/* Event Details */}
      {(details.venue || details.guests) && (
        <div className="bg-secondary/50 rounded-lg p-2 space-y-1">
          {details.venue && (
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
              <span><strong>Venue:</strong> {details.venue}</span>
            </div>
          )}
          {details.guests && (
            <div className="flex items-start gap-2">
              <Users size={14} className="text-primary mt-0.5 shrink-0" />
              <span><strong>Guests:</strong> {details.guests}</span>
            </div>
          )}
        </div>
      )}

      {/* Additional Notes */}
      {details.additionalNotes && (
        <div className="flex items-start gap-2 text-muted-foreground">
          <MessageSquare size={14} className="mt-0.5 shrink-0" />
          <span>{details.additionalNotes}</span>
        </div>
      )}
    </div>
  );
};

export default BookingDetailsCard;
