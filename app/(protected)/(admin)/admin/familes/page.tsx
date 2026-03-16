import { FamilyTreeContent } from "@/components/family-tree/family-tree-content";
import { FamilyProvider } from "@/context/FamilyContext";

export default function FamilyPage() {
  return (
    <FamilyProvider>
      <div className="min-h-screen flex flex-col">
        {/* <FamilyControls /> */}
        <FamilyTreeContent />
      </div>
    </FamilyProvider>
  )
}