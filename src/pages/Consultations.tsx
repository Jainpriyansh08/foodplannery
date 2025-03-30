
import React, { useState } from "react";
import { format, parseISO, addDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMeals, Consultation } from "@/context/MealContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const AVAILABLE_TIMES = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
];

const Consultations: React.FC = () => {
  const [date, setDate] = useState<Date>(addDays(new Date(), 1));
  const [time, setTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const { consultations, requestConsultation, cancelConsultation } = useMeals();
  const { toast } = useToast();
  
  const handleScheduleConsultation = () => {
    if (!date || !time) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and time for your consultation.",
        variant: "destructive",
      });
      return;
    }
    
    const dateStr = format(date, "yyyy-MM-dd");
    requestConsultation(dateStr, time, notes);
    
    toast({
      title: "Consultation Scheduled",
      description: `Your consultation has been scheduled for ${format(date, "MMMM d")} at ${time}.`,
    });
    
    setTime("");
    setNotes("");
    setShowScheduleDialog(false);
  };
  
  const handleCancelConsultation = (id: string) => {
    cancelConsultation(id);
    toast({
      title: "Consultation Cancelled",
      description: "Your consultation has been cancelled successfully.",
    });
  };
  
  // Sort consultations by date and time (most recent first)
  const sortedConsultations = [...consultations].sort((a, b) => {
    const dateA = parseISO(`${a.date}T${a.time}`);
    const dateB = parseISO(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
  
  const upcomingConsultations = sortedConsultations.filter(c => {
    const consultationDate = parseISO(`${c.date}T${c.time}`);
    return consultationDate > new Date();
  });
  
  const pastConsultations = sortedConsultations.filter(c => {
    const consultationDate = parseISO(`${c.date}T${c.time}`);
    return consultationDate <= new Date();
  });

  return (
    <div className="container mx-auto max-w-3xl p-4 pb-20 md:pb-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Meal Prep Consultations</h1>
          <p className="text-muted-foreground">Schedule a one-on-one meal prep session</p>
        </div>
        <Button onClick={() => setShowScheduleDialog(true)}>
          Schedule Consultation
        </Button>
      </div>
      
      <div className="space-y-6">
        {upcomingConsultations.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Consultations</h2>
            <div className="space-y-3">
              {upcomingConsultations.map((consultation) => (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  onCancel={handleCancelConsultation}
                />
              ))}
            </div>
          </div>
        )}
        
        {pastConsultations.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Past Consultations</h2>
            <div className="space-y-3">
              {pastConsultations.map((consultation) => (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  isPast
                />
              ))}
            </div>
          </div>
        )}
        
        {upcomingConsultations.length === 0 && pastConsultations.length === 0 && (
          <Card className="border-dashed bg-muted/30">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">You haven't scheduled any consultations yet</p>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setShowScheduleDialog(true)}
              >
                Schedule Your First Consultation
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Consultation</DialogTitle>
            <DialogDescription>
              Book a one-on-one meal preparation consultation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Select Time</Label>
              <Select onValueChange={setTime} value={time}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_TIMES.map((timeSlot) => (
                    <SelectItem key={timeSlot} value={timeSlot}>
                      {timeSlot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Tell us about your dietary preferences, goals, or any questions you have"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleScheduleConsultation}>
              Schedule Consultation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ConsultationCardProps {
  consultation: Consultation;
  onCancel?: (id: string) => void;
  isPast?: boolean;
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({ 
  consultation, 
  onCancel,
  isPast = false
}) => {
  const consultationDate = parseISO(consultation.date);
  
  return (
    <Card className={cn(
      "relative overflow-hidden",
      isPast && "opacity-75"
    )}>
      <div className={cn(
        "absolute h-full w-1 left-0 top-0",
        isPast ? "bg-muted" : "bg-primary"
      )} />
      
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">
            Meal Prep Consultation
          </CardTitle>
          {!isPast && onCancel && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => onCancel(consultation.id)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel</span>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-start space-x-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center text-sm">
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{format(consultationDate, "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{consultation.time}</span>
            </div>
            {consultation.notes && (
              <>
                <Separator className="my-2" />
                <p className="text-sm text-muted-foreground">
                  {consultation.notes}
                </p>
              </>
            )}
          </div>
          <div className="flex items-center">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Consultations;
