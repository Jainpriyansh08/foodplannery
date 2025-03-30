
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useMeals, Meal } from "@/context/MealContext";
import MealCard from "@/components/meal/MealCard";
import MealForm from "@/components/meal/MealForm";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const Index: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { meals, addMeal, toggleMealCompleted } = useMeals();
  const [showAddMeal, setShowAddMeal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get today's date in YYYY-MM-DD format
  const today = format(new Date(), "yyyy-MM-dd");
  const todaysMeals = meals.filter((meal) => meal.date === today);

  const handleAddMeal = (meal: Omit<Meal, "id">) => {
    addMeal(meal);
    setShowAddMeal(false);
    toast({
      title: "Meal Added",
      description: `${meal.name} has been added to your plan.`,
    });
  };

  const completedMeals = todaysMeals.filter((meal) => meal.completed).length;
  const progressPercentage = todaysMeals.length > 0 
    ? Math.round((completedMeals / todaysMeals.length) * 100) 
    : 0;

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container max-w-md mx-auto p-4 pb-20 md:pb-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hello, {user?.name || "there"}!</h1>
          <p className="text-muted-foreground">Let's plan your meals for today</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => navigate("/calendar")}>
          <CalendarIcon className="h-4 w-4 mr-1" />
          Calendar
        </Button>
      </div>

      {todaysMeals.length > 0 ? (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center text-sm mb-2">
              <span>{completedMeals} of {todaysMeals.length} meals completed</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-primary rounded-full h-2.5 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6 bg-muted/30 border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No meals planned for today</p>
            <Button variant="default" size="sm" onClick={() => setShowAddMeal(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Meal
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Today's Meals</h2>
        <Dialog open={showAddMeal} onOpenChange={setShowAddMeal}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <h2 className="text-xl font-semibold mb-4">Add New Meal</h2>
            <MealForm
              onSubmit={handleAddMeal}
              onCancel={() => setShowAddMeal(false)}
              initialMeal={{ date: today }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {todaysMeals.length > 0 ? (
        <div className="space-y-3">
          {todaysMeals
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
        <div className="text-center text-muted-foreground p-8">
          <p>No meals added for today.</p>
          <p className="text-sm mt-2">Start by adding your first meal.</p>
        </div>
      )}
    </div>
  );
};

export default Index;
