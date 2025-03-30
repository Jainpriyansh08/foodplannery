
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMeals, Meal } from "@/context/MealContext";
import MealCard from "@/components/meal/MealCard";
import MealForm from "@/components/meal/MealForm";
import CalendarView from "@/components/meal/CalendarView";
import { useToast } from "@/hooks/use-toast";

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddMeal, setShowAddMeal] = useState(false);
  const { meals, addMeal, toggleMealCompleted } = useMeals();
  const navigate = useNavigate();
  const { toast } = useToast();

  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const selectedDateMeals = meals.filter((meal) => meal.date === formattedDate);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddMeal = (meal: Omit<Meal, "id">) => {
    addMeal(meal);
    setShowAddMeal(false);
    toast({
      title: "Meal Added",
      description: `${meal.name} has been added to your plan.`,
    });
  };

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <div className="flex flex-col md:flex-row md:gap-6">
        <div className="md:w-7/12 lg:w-8/12 mb-6 md:mb-0">
          <h1 className="text-2xl font-bold mb-4">Meal Calendar</h1>
          <CalendarView onSelectDate={handleDateSelect} />
        </div>

        <div className="md:w-5/12 lg:w-4/12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {format(selectedDate, "MMMM d, yyyy")}
            </h2>
            <Dialog open={showAddMeal} onOpenChange={setShowAddMeal}>
              <Button size="sm" onClick={() => setShowAddMeal(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Meal
              </Button>
              <DialogContent className="sm:max-w-[425px]">
                <h2 className="text-xl font-semibold mb-4">Add New Meal</h2>
                <MealForm
                  onSubmit={handleAddMeal}
                  onCancel={() => setShowAddMeal(false)}
                  initialMeal={{ date: formattedDate }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {selectedDateMeals.length > 0 ? (
            <div className="space-y-3">
              {selectedDateMeals
                .sort((a, b) => {
                  const mealOrder = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
                  return mealOrder[a.mealType] - mealOrder[b.mealType];
                })
                .map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    onClick={() => navigate(`/meal/${meal.id}`)}
                    onComplete={() => {
                      toggleMealCompleted(meal.id);
                      toast({
                        title: meal.completed ? "Meal Unmarked" : "Meal Completed",
                        description: `${meal.name} has been ${meal.completed ? "unmarked" : "marked as completed"}.`,
                      });
                    }}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-8 bg-muted/30 rounded-lg border-dashed border">
              <p>No meals for {format(selectedDate, "MMMM d")}.</p>
              <Button className="mt-4" size="sm" variant="outline" onClick={() => setShowAddMeal(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add a meal
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
