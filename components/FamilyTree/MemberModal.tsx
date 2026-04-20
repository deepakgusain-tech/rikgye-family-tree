import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { validateMember, type MemberRole, type Gender } from '@/store/familyStore';

interface MemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, role: MemberRole, gender: Gender) => void;
  title: string;
  initialName?: string;
  initialRole?: MemberRole;
  initialGender?: Gender;
  allowedRoles?: MemberRole[];
  roleLabelMap?: Partial<Record<MemberRole, string>>;
}

export default function MemberModal({
  open,
  onClose,
  onSubmit,
  title,
  initialName = '',
  initialRole = 'child',
  initialGender = 'male',
  allowedRoles = ['father', 'wife', 'ex-wife', 'child'],
  roleLabelMap,
}: MemberModalProps) {
  const [name, setName] = useState(initialName);
  const [role, setRole] = useState<MemberRole>(initialRole);
  const [gender, setGender] = useState<Gender>(initialGender);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setRole(initialRole);
      setGender(initialGender);
      setError(null);
    }
  }, [open, initialName, initialRole, initialGender]);

  const handleSubmit = () => {
    const err = validateMember(name, role);
    if (err) {
      setError(err);
      return;
    }
    onSubmit(name.trim(), role, gender);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="member-name">Name</Label>
            <Input
              id="member-name"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null); }}
              placeholder="Enter name"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={gender === 'male' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setGender('male')}
              >
                ♂ Male
              </Button>
              <Button
                type="button"
                variant={gender === 'female' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setGender('female')}
              >
                ♀ Female
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => { setRole(v as MemberRole); setError(null); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allowedRoles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {roleLabelMap?.[r] ?? (r.charAt(0).toUpperCase() + r.slice(1))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
