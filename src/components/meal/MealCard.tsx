
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight } from "lucide-react";
import { Meal } from "@/context/MealContext";
import { format } from "date-fns";

interface MealCardProps {
  meal: Meal;
  onClick?: () => void;
  onComplete?: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onClick, onComplete }) => {
  const mealTypeColors = {
    breakfast: "bg-food-orange-light text-food-orange-dark",
    lunch: "bg-food-green-light text-food-green-dark",
    dinner: "bg-food-teal-light text-food-teal-dark",
    snack: "bg-muted text-muted-foreground",
  };

  const mealDate = new Date(meal.date);
  const isToday = new Date().toDateString() === mealDate.toDateString();

  return (
    <Card className={`meal-card cursor-pointer ${meal.completed ? "opacity-75" : ""}`} onClick={onClick}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div>
          <Badge className={mealTypeColors[meal.mealType]}>
            {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
          </Badge>
          <CardTitle className="text-lg mt-1">{meal.name}</CardTitle>
        </div>
        {isToday && (
          <button 
            className={`rounded-full p-1 ${
              meal.completed ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onComplete?.();
            }}
          >
            <Check className="h-5 w-5" />
          </button>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {meal.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {meal.description}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {format(mealDate, "MMM d")} · {meal.calories ? `${meal.calories} kcal` : "No calories info"}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MealCard;
