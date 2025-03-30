
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Meal } from "@/context/MealContext";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MealFormProps {
  onSubmit: (meal: Omit<Meal, "id">) => void;
  onCancel: () => void;
  initialMeal?: Partial<Meal>;
}

const MealForm: React.FC<MealFormProps> = ({
  onSubmit,
  onCancel,
  initialMeal = {},
}) => {
  const [date, setDate] = useState<Date>(
    initialMeal.date ? new Date(initialMeal.date) : new Date()
  );
  const [mealType, setMealType] = useState<Meal["mealType"]>(
    initialMeal.mealType || "lunch"
  );
  const [name, setName] = useState(initialMeal.name || "");
  const [description, setDescription] = useState(initialMeal.description || "");
  const [calories, setCalories] = useState(initialMeal.calories?.toString() || "");
  const [protein, setProtein] = useState(initialMeal.protein?.toString() || "");
  const [carbs, setCarbs] = useState(initialMeal.carbs?.toString() || "");
  const [fat, setFat] = useState(initialMeal.fat?.toString() || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date: format(date, "yyyy-MM-dd"),
      mealType,
      name,
      description,
      calories: calories ? Number(calories) : undefined,
      protein: protein ? Number(protein) : undefined,
      carbs: carbs ? Number(carbs) : undefined,
      fat: fat ? Number(fat) : undefined,
      completed: initialMeal.completed || false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Meal Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter meal name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
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
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mealType">Meal Type</Label>
          <Select value={mealType} onValueChange={(value) => setMealType(value as Meal["mealType"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select meal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your meal"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Nutrition Information</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="calories" className="text-xs">Calories</Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="kcal"
            />
          </div>
          <div>
            <Label htmlFor="protein" className="text-xs">Protein</Label>
            <Input
              id="protein"
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="g"
            />
          </div>
          <div>
            <Label htmlFor="carbs" className="text-xs">Carbs</Label>
            <Input
              id="carbs"
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="g"
            />
          </div>
          <div>
            <Label htmlFor="fat" className="text-xs">Fat</Label>
            <Input
              id="fat"
              type="number"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="g"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="default">
          Save Meal
        </Button>
      </div>
    </form>
  );
};

export default MealForm;
