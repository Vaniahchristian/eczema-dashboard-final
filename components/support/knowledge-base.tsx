"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, FileText, ArrowRight, ThumbsUp, ThumbsDown, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Sample knowledge base articles
const articles = [
  {
    id: "article-1",
    title: "Understanding Eczema Triggers",
    description: "Learn about common triggers that can cause eczema flare-ups",
    category: "education",
    tags: ["triggers", "flare-ups", "prevention"],
    content: `
      <h3>Common Eczema Triggers</h3>
      <p>Eczema flare-ups can be triggered by various factors. Understanding your personal triggers is key to managing your condition.</p>
      <ul>
        <li><strong>Environmental factors:</strong> Dust, pollen, mold, and pet dander</li>
        <li><strong>Irritants:</strong> Soaps, detergents, shampoos, disinfectants, and juices from fresh fruits, vegetables, and meats</li>
        <li><strong>Weather:</strong> Hot weather, high and low humidity, and perspiration from exercise</li>
        <li><strong>Stress:</strong> Emotional stress can trigger or worsen eczema</li>
        <li><strong>Food allergies:</strong> Dairy, eggs, nuts, seeds, soy, and wheat</li>
      </ul>
      <p>Track your exposures and symptoms in the EczemaAI app to identify your personal triggers.</p>
    `,
    helpful: 124,
    views: 1893,
    rating: 4.8,
  },
  {
    id: "article-2",
    title: "Daily Skin Care Routine for Eczema",
    description: "Establish an effective daily skin care routine to manage eczema",
    category: "treatment",
    tags: ["skincare", "moisturizing", "bathing"],
    content: `
      <h3>Effective Daily Skin Care for Eczema</h3>
      <p>A consistent skin care routine is essential for managing eczema and preventing flare-ups.</p>
      <h4>Morning Routine:</h4>
      <ol>
        <li>Cleanse with a gentle, fragrance-free cleanser</li>
        <li>Apply prescribed medications to affected areas</li>
        <li>Apply a thick moisturizer all over the body</li>
        <li>Wait 15-20 minutes before getting dressed</li>
      </ol>
      <h4>Evening Routine:</h4>
      <ol>
        <li>Take a lukewarm bath or shower (no more than 10-15 minutes)</li>
        <li>Use gentle, fragrance-free cleansers</li>
        <li>Pat skin dry with a soft towel</li>
        <li>Apply medications within 3 minutes of bathing</li>
        <li>Apply a thick layer of moisturizer</li>
      </ol>
      <p>Remember to reapply moisturizer throughout the day as needed, especially after washing hands.</p>
    `,
    helpful: 189,
    views: 2341,
    rating: 4.9,
  },
  {
    id: "article-3",
    title: "Using the EczemaAI Tracking Features",
    description: "Get the most out of the EczemaAI tracking tools",
    category: "app-usage",
    tags: ["tracking", "app-features", "data"],
    content: `
      <h3>Maximizing EczemaAI Tracking Features</h3>
      <p>EczemaAI offers powerful tracking tools to help you manage your condition effectively.</p>
      <h4>Key Tracking Features:</h4>
      <ul>
        <li><strong>Symptom Tracker:</strong> Log the severity, location, and appearance of your symptoms daily</li>
        <li><strong>Trigger Tracker:</strong> Record potential triggers you've been exposed to</li>
        <li><strong>Treatment Tracker:</strong> Monitor which treatments you're using and their effectiveness</li>
        <li><strong>Photo Documentation:</strong> Take photos of affected areas to track visual changes over time</li>
        <li><strong>Correlation Analysis:</strong> The AI will analyze your data to identify patterns between triggers and flare-ups</li>
      </ul>
      <p>For best results, track consistently every day, even when symptoms are minimal.</p>
    `,
    helpful: 97,
    views: 1245,
    rating: 4.6,
  },
  {
    id: "article-4",
    title: "Troubleshooting Account Login Issues",
    description: "Solutions for common login and account access problems",
    category: "technical",
    tags: ["account", "login", "password"],
    content: `
      <h3>Resolving Account Login Issues</h3>
      <p>If you're having trouble accessing your EczemaAI account, try these solutions:</p>
      <h4>Common Issues and Solutions:</h4>
      <ol>
        <li><strong>Forgotten Password:</strong> Use the "Forgot Password" link on the login screen to reset your password via email</li>
        <li><strong>Email Not Received:</strong> Check your spam folder, verify your email address is correct, or try an alternative email</li>
        <li><strong>Account Locked:</strong> After multiple failed login attempts, your account may be temporarily locked. Wait 30 minutes and try again</li>
        <li><strong>App  your account may be temporarily locked. Wait 30 minutes and try again</li>
        <li><strong>App Crashes:</strong> Update to the latest version of the app, or try uninstalling and reinstalling</li>
        <li><strong>Device Compatibility:</strong> Ensure your device meets the minimum requirements for running EczemaAI</li>
      </ol>
      <p>If you continue to experience issues, please contact our support team through the Support Channels tab.</p>
    `,
    helpful: 76,
    views: 982,
    rating: 4.5,
  },
]

// Sample FAQs
const faqs = [
  {
    id: "faq-1",
    question: "How do I upload photos of my skin condition?",
    answer:
      "To upload photos, go to the Dashboard and tap the 'Upload' button. You can take a new photo or select one from your gallery. Make sure the affected area is clearly visible and well-lit for the best analysis results.",
  },
  {
    id: "faq-2",
    question: "Can I share my eczema data with my doctor?",
    answer:
      "Yes! Go to Settings > Data Sharing and select 'Share with Healthcare Provider'. You can generate a report of your data and either send it directly to your doctor through our secure system or download it as a PDF to share during your appointment.",
  },
  {
    id: "faq-3",
    question: "How accurate is the AI diagnosis?",
    answer:
      "EczemaAI provides a preliminary assessment with approximately 90% accuracy compared to dermatologist diagnoses. However, it's not a replacement for professional medical advice. Always consult with a healthcare provider for official diagnosis and treatment recommendations.",
  },
  {
    id: "faq-4",
    question: "Is my health data secure?",
    answer:
      "Absolutely. EczemaAI uses end-to-end encryption and follows HIPAA compliance standards. Your data is stored securely and is never shared with third parties without your explicit consent. You can review our privacy policy in Settings > Privacy.",
  },
  {
    id: "faq-5",
    question: "How do I cancel or reschedule an appointment?",
    answer:
      "To manage your appointments, go to the Appointments tab and select the appointment you wish to modify. Use the 'Reschedule' or 'Cancel' button. Please note that cancellations made less than 24 hours before the appointment may incur a fee, depending on your provider's policy.",
  },
]

export default function KnowledgeBase() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null)

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === "all" || article.category === activeCategory

    return matchesSearch && matchesCategory
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Analytics tracking would go here in a real app
    if (searchQuery && !filteredArticles.length) {
      toast({
        title: "No results found",
        description: "Try different keywords or browse our categories",
        duration: 3000,
      })
    }
  }

  const handleArticleRating = (articleId: string, isHelpful: boolean) => {
    toast({
      title: isHelpful ? "Thank you for your feedback!" : "We'll improve this article",
      description: isHelpful ? "We're glad this article was helpful" : "Your feedback helps us improve our content",
      duration: 3000,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles..."
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      <Tabs defaultValue="articles" className="mb-6">
        <TabsList>
          <TabsTrigger value="articles">Help Articles</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="mt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              variant={activeCategory === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory("all")}
            >
              All
            </Badge>
            <Badge
              variant={activeCategory === "education" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory("education")}
            >
              Education
            </Badge>
            <Badge
              variant={activeCategory === "treatment" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory("treatment")}
            >
              Treatment
            </Badge>
            <Badge
              variant={activeCategory === "app-usage" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory("app-usage")}
            >
              App Usage
            </Badge>
            <Badge
              variant={activeCategory === "technical" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory("technical")}
            >
              Technical
            </Badge>
          </div>

          <div className="space-y-4">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{article.title}</CardTitle>
                          <CardDescription>{article.description}</CardDescription>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{article.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>

                    {expandedArticle === article.id ? (
                      <CardContent>
                        <div
                          dangerouslySetInnerHTML={{ __html: article.content }}
                          className="prose prose-sm max-w-none"
                        />
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => handleArticleRating(article.id, true)}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span>Helpful ({article.helpful})</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => handleArticleRating(article.id, false)}
                            >
                              <ThumbsDown className="h-3 w-3" />
                              <span>Not helpful</span>
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground">{article.views} views</div>
                        </div>
                      </CardContent>
                    ) : (
                      <CardFooter className="pt-2">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 p-0 h-auto"
                          onClick={() => setExpandedArticle(article.id)}
                        >
                          <span>Read article</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No articles found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p>{faq.answer}</p>
                  <div className="mt-4 flex justify-end">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>Helpful</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <ThumbsDown className="h-3 w-3" />
                        <span>Not helpful</span>
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  )
}

