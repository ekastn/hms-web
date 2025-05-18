import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "../../lib/utils";

interface CardStatsProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export const CardStats: React.FC<CardStatsProps> = ({
    title,
    value,
    icon,
    description,
    trend,
    className,
}) => {
    return (
        <Card className={cn("", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {trend && (
                    <p
                        className={cn(
                            "text-xs",
                            trend.isPositive ? "text-green-500" : "text-red-500"
                        )}
                    >
                        {trend.isPositive ? "+" : "-"}
                        {trend.value}%{" "}
                        <span className="text-muted-foreground">from last month</span>
                    </p>
                )}
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </CardContent>
        </Card>
    );
};
