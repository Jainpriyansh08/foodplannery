
import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMeals } from "@/context/MealContext";

interface CalendarViewProps {
  onSelectDate: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { meals } = useMeals();
  
  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Calculate which days of the month have meals
  const daysWithMeals = days.reduce<Record<string, boolean>>((acc, day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    acc[dateStr] = meals.some(meal => meal.date === dateStr);
    return acc;
  }, {});
  
  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentMonth(new Date());
  };
  
  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-border text-center text-xs">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 font-medium">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-border">
        {Array(startDate.getDay())
          .fill(null)
          .map((_, i) => (
            <div key={`empty-start-${i}`} className="bg-background" />
          ))}
        
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const hasMeals = daysWithMeals[dateStr];
          
          return (
            <div
              key={day.toISOString()}
              className={`day-cell bg-background cursor-pointer ${
                isToday(day) ? "today" : ""
              } ${hasMeals ? "has-meals" : ""}`}
              onClick={() => onSelectDate(day)}
            >
              <div className={`text-sm ${
                !isSameMonth(day, currentMonth) ? "text-muted-foreground" : ""
              }`}>
                {format(day, "d")}
              </div>
            </div>
          );
        })}
        
        {Array(6 - endDate.getDay())
          .fill(null)
          .map((_, i) => (
            <div key={`empty-end-${i}`} className="bg-background" />
          ))}
      </div>
    </div>
  );
};

export default CalendarView;
