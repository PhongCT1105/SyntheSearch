import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CardWithFormProps {
  keyword: string;
  onNext: () => void;
  setKeyword: (value: string) => void;
}

function CardWithForm({ keyword, onNext, setKeyword }: CardWithFormProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Research keyword</CardTitle>
        <CardDescription>Look for research paper in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onNext}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Keyword</Label>
              <Input
                id="keywordInput"
                placeholder="Enter the keyword here"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onNext}>Next</Button>
      </CardFooter>
    </Card>
  )
}

export default CardWithForm;
