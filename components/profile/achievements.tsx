"use client"

import { motion } from "framer-motion"
import { Award, Star, Trophy, Target, Zap, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Achievements() {
  const achievements = [
    {
      id: 1,
      name: "Consistency Champion",
      description: "Tracked health data for 30 consecutive days",
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      earned: true,
      date: "March 15, 2025",
    },
    {
      id: 2,
      name: "Insight Explorer",
      description: "Discovered 10 potential triggers through tracking",
      icon: <Zap className="h-5 w-5 text-purple-500" />,
      earned: true,
      date: "February 28, 2025",
    },
    {
      id: 3,
      name: "Goal Getter",
      description: "Achieved 5 personal health goals",
      icon: <Target className="h-5 w-5 text-emerald-500" />,
      earned: true,
      date: "January 22, 2025",
    },
    {
      id: 4,
      name: "Community Contributor",
      description: "Helped 25 community members with advice",
      icon: <Star className="h-5 w-5 text-blue-500" />,
      earned: false,
      progress: 68,
    },
    {
      id: 5,
      name: "Wellness Warrior",
      description: "Maintained healthy habits for 3 months",
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
      earned: false,
      progress: 42,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2 text-primary" />
          Achievements
        </CardTitle>
        <CardDescription>Track your progress and earn badges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`flex items-center p-3 rounded-lg ${achievement.earned ? "bg-slate-100 dark:bg-slate-800" : "bg-slate-50 dark:bg-slate-900"}`}
                    >
                      <div
                        className={`p-2 rounded-full mr-3 ${achievement.earned ? "bg-white dark:bg-slate-700" : "bg-slate-100 dark:bg-slate-800"}`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-slate-900 dark:text-slate-100">{achievement.name}</h3>
                          {achievement.earned && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">{achievement.date}</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{achievement.description}</p>
                        {!achievement.earned && (
                          <div className="mt-2">
                            <Progress value={achievement.progress} className="h-2" />
                            <p className="text-xs text-right mt-1 text-slate-500 dark:text-slate-400">
                              {achievement.progress}% complete
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {achievement.earned
                      ? `Earned on ${achievement.date}`
                      : `${achievement.progress}% progress towards this achievement`}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

