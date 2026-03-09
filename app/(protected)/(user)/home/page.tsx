import { FamilyTreeContent } from "@/components/family-tree/family-tree-content";
import { FamilyProvider } from "@/context/FamilyContext"

export default function Page() {
  return (
    <FamilyProvider>
      <div className="min-h-screen flex flex-col bg-background">
        {/* <FamilyControls /> */}
        <FamilyTreeContent />
      </div>
    </FamilyProvider>
  )
}