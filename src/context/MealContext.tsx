
import React, { createContext, useContext, useState, useEffect } from "react";

export interface Meal {
  id: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients?: string[];
  imageUrl?: string;
  completed?: boolean;
}

export interface Consultation {
  id: string;
  userId: string;
  date: string;
  time: string;
  notes?: string;
  confirmed: boolean;
}

interface MealContextType {
  meals: Meal[];
  consultations: Consultation[];
  addMeal: (meal: Omit<Meal, "id">) => void;
  updateMeal: (id: string, meal: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;
  toggleMealCompleted: (id: string) => void;
  getMealsByDate: (date: string) => Meal[];
  getMealsByMonth: (year: number, month: number) => Record<string, Meal[]>;
  requestConsultation: (date: string, time: string, notes?: string) => void;
  cancelConsultation: (id: string) => void;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export const MealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  // Load saved meals from localStorage
  useEffect(() => {
    const savedMeals = localStorage.getItem("foodplannery_meals");
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals));
    }

    const savedConsultations = localStorage.getItem("foodplannery_consultations");
    if (savedConsultations) {
      setConsultations(JSON.parse(savedConsultations));
    }
  }, []);

  // Save meals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("foodplannery_meals", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem("foodplannery_consultations", JSON.stringify(consultations));
  }, [consultations]);

  const addMeal = (meal: Omit<Meal, "id">) => {
    const newMeal: Meal = {
      ...meal,
      id: Date.now().toString(),
    };
    setMeals((prevMeals) => [...prevMeals, newMeal]);
  };

  const updateMeal = (id: string, updates: Partial<Meal>) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal.id === id ? { ...meal, ...updates } : meal
      )
    );
  };

  const deleteMeal = (id: string) => {
    setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== id));
  };

  const toggleMealCompleted = (id: string) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal.id === id ? { ...meal, completed: !meal.completed } : meal
      )
    );
  };

  const getMealsByDate = (date: string) => {
    return meals.filter((meal) => meal.date === date);
  };

  const getMealsByMonth = (year: number, month: number) => {
    const filteredMeals = meals.filter((meal) => {
      const mealDate = new Date(meal.date);
      return (
        mealDate.getFullYear() === year && mealDate.getMonth() === month
      );
    });

    const groupedMeals: Record<string, Meal[]> = {};
    filteredMeals.forEach((meal) => {
      if (!groupedMeals[meal.date]) {
        groupedMeals[meal.date] = [];
      }
      groupedMeals[meal.date].push(meal);
    });

    return groupedMeals;
  };

  const requestConsultation = (date: string, time: string, notes?: string) => {
    const newConsultation: Consultation = {
      id: Date.now().toString(),
      userId: "current-user", // In a real app, this would come from auth
      date,
      time,
      notes,
      confirmed: false,
    };
    setConsultations((prev) => [...prev, newConsultation]);
  };

  const cancelConsultation = (id: string) => {
    setConsultations((prev) => prev.filter((consultation) => consultation.id !== id));
  };

  return (
    <MealContext.Provider
      value={{
        meals,
        consultations,
        addMeal,
        updateMeal,
        deleteMeal,
        toggleMealCompleted,
        getMealsByDate,
        getMealsByMonth,
        requestConsultation,
        cancelConsultation,
      }}
    >
      {children}
    </MealContext.Provider>
  );
};

export const useMeals = () => {
  const context = useContext(MealContext);
  if (context === undefined) {
    throw new Error("useMeals must be used within a MealProvider");
  }
  return context;
};
