import { QuestionsHeader } from "./QuestionsHeader"
import { QuestionsList } from "./QuestionsList"

export function QuestionsPage() {
  return (
    <div className="flex flex-col w-full h-[calc(100vh-65px)]">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 h-full">
        <QuestionsHeader />
        <QuestionsList />
      </div>
    </div>
  )
}
