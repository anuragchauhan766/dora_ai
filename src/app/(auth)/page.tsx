import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, FileText, Link as LinkIcon } from "lucide-react";

export default async function HomePage() {
  return (
    <div className="flex-1">
      <section className="flex w-full items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Train AI with Your Data
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                Create custom AI models using your own documents and links. Chat with your data and get insights in
                seconds.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/signup">
                <Button className="h-11 px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" className="h-11 px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="flex w-full items-center justify-center bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32"
      >
        <div className="container px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
              <FileText className="h-12 w-12 text-blue-500" />
              <h3 className="text-xl font-bold">Document Upload</h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Easily upload and process your documents to train your AI model.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
              <LinkIcon className="h-12 w-12 text-green-500" />
              <h3 className="text-xl font-bold">Link Processing</h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Add web links to expand your AI&apos;s knowledge base effortlessly.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
              <Bot className="h-12 w-12 text-purple-500" />
              <h3 className="text-xl font-bold">AI Chat Interface</h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Interact with your trained AI model through a user-friendly chat interface.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="flex w-full items-center justify-center py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
          <ol className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <li className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
              <span className="text-3xl font-bold text-blue-500">1</span>
              <h3 className="text-xl font-bold">Create a Project</h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Start by creating a new project for your AI model.
              </p>
            </li>
            <li className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
              <span className="text-3xl font-bold text-green-500">2</span>
              <h3 className="text-xl font-bold">Add Your Data</h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Upload documents or add links to train your AI model.
              </p>
            </li>
            <li className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
              <span className="text-3xl font-bold text-purple-500">3</span>
              <h3 className="text-xl font-bold">Chat and Get Insights</h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Interact with your AI through the chat interface and gain valuable insights.
              </p>
            </li>
          </ol>
        </div>
      </section>
      <section
        id="pricing"
        className="flex w-full items-center justify-center bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32"
      >
        <div className="container px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">Simple Pricing</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
              <h3 className="mb-4 text-center text-2xl font-bold">Basic</h3>
              <p className="mb-4 text-center text-gray-500 dark:text-gray-400">Perfect for individuals</p>
              <p className="mb-6 text-center text-4xl font-bold">
                $9.99<span className="text-sm font-normal">/month</span>
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-5 w-5 text-green-500" />
                  <span>1 Project</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-5 w-5 text-green-500" />
                  <span>100 Document Uploads</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-5 w-5 text-green-500" />
                  <span>500 Chat Messages</span>
                </li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </div>
            <div className="flex flex-col rounded-lg bg-blue-600 p-6 shadow-lg">
              <h3 className="mb-4 text-center text-2xl font-bold text-white">Pro</h3>
              <p className="mb-4 text-center text-blue-100">Great for small teams</p>
              <p className="mb-6 text-center text-4xl font-bold text-white">
                $29.99
                <span className="text-sm font-normal">/month</span>
              </p>
              <ul className="mb-6 space-y-2 text-white">
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-5 w-5 text-white" />
                  <span>5 Projects</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-5 w-5 text-white" />
                  <span>500 Document Uploads</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-5 w-5 text-white" />
                  <span>2500 Chat Messages</span>
                </li>
              </ul>
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">Get Started</Button>
            </div>
            <div className="flex flex-col rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
              <h3 className="mb-4 text-center text-2xl font-bold">Enterprise</h3>
              <p className="mb-4 text-center text-gray-500 dark:text-gray-400">For large organizations</p>
              <p className="mb-6 text-center text-4xl font-bold">Custom</p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-5 w-5 text-green-500" />
                  <span>Unlimited Projects</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-5 w-5 text-green-500" />
                  <span>Unlimited Document Uploads</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-5 w-5 text-green-500" />
                  <span>Unlimited Chat Messages</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
