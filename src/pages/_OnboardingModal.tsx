import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Users, Workflow, Import } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-display">
            <Rocket className="text-orange-500" />
            Welcome to OrionHub!
          </DialogTitle>
          <DialogDescription>
            You're all set up. What would you like to do first?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button variant="outline" size="lg" onClick={() => handleNavigation('/app/contacts')}>
            <Import className="mr-2 h-4 w-4" /> Import Your Contacts
          </Button>
          <Button variant="outline" size="lg" onClick={() => handleNavigation('/app/pipeline')}>
            <Users className="mr-2 h-4 w-4" /> Set Up Your First Pipeline
          </Button>
          <Button variant="outline" size="lg" onClick={() => handleNavigation('/app/automations')}>
            <Workflow className="mr-2 h-4 w-4" /> Create an Automation
          </Button>
        </div>
        <Button onClick={() => onOpenChange(false)}>I'll explore on my own</Button>
      </DialogContent>
    </Dialog>
  );
}