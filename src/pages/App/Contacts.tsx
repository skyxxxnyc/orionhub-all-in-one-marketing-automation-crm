import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Import, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
const mockContacts = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', tags: ['lead', 'newsletter'], lastActivity: '2 days ago' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', tags: ['customer', 'vip'], lastActivity: '1 hour ago' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', tags: ['prospect'], lastActivity: '5 days ago' },
  { id: '4', name: 'Diana Miller', email: 'diana@example.com', tags: ['lead'], lastActivity: '1 week ago' },
  { id: '5', name: 'Ethan Davis', email: 'ethan@example.com', tags: ['customer'], lastActivity: '3 hours ago' },
];
export function Contacts() {
  const [selected, setSelected] = useState<string[]>([]);
  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelected(mockContacts.map(c => c.id));
    } else {
      setSelected([]);
    }
  };
  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelected(prev => [...prev, id]);
    } else {
      setSelected(prev => prev.filter(rowId => rowId !== id));
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
            <p className="text-muted-foreground">Manage your contacts and leads.</p>
          </div>
          <div className="flex gap-2">
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Contact</Button>
            <Button variant="outline"><Import className="mr-2 h-4 w-4" /> Import</Button>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search contacts..." className="pl-8" />
          </div>
          {selected.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selected.length} selected</span>
              <Button variant="outline" size="sm">Add Tag</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          )}
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selected.length === mockContacts.length ? true : selected.length > 0 ? 'indeterminate' : false}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(contact.id)}
                      onCheckedChange={(checked) => handleSelectRow(contact.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell className="text-muted-foreground">{contact.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {contact.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{contact.lastActivity}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                        <DropdownMenuItem>Start Automation</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}