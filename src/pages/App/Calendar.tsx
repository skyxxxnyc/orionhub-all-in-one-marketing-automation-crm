import React, { useState } from 'react';
import { add, format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { CalendarEvent } from '@shared/types';
import { AppointmentDetail } from '@/components/AppointmentDetail';
import { BookingWidget } from '@/components/BookingWidget';
const fetchEvents = async (start: Date, end: Date) => {
  // In a real app, you'd pass start/end to the API
  // For this mock, we fetch all and filter client-side
  const { items } = await api<{ items: CalendarEvent[] }>('/api/calendar/events');
  return items.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate >= start && eventDate <= end;
  });
};
export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const start = view === 'month' ? startOfMonth(currentDate) : startOfWeek(currentDate, { weekStartsOn: 1 });
  const end = view === 'month' ? endOfMonth(currentDate) : endOfWeek(currentDate, { weekStartsOn: 1 });
  const { data: events, isLoading } = useQuery({
    queryKey: ['calendarEvents', view, format(currentDate, 'yyyy-MM-dd')],
    queryFn: () => fetchEvents(start, end),
  });
  const days = eachDayOfInterval({ start, end });
  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events?.forEach(event => {
      const dayKey = format(new Date(event.start), 'yyyy-MM-dd');
      if (!map.has(dayKey)) {
        map.set(dayKey, []);
      }
      map.get(dayKey)?.push(event);
    });
    return map;
  }, [events]);
  const changeDate = (amount: number) => {
    const newDate = add(currentDate, { [view === 'month' ? 'months' : 'weeks']: amount });
    setCurrentDate(newDate);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground">Manage your appointments and schedule.</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button><PlusCircle className="mr-2 h-4 w-4" /> New Appointment</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Book an Appointment</SheetTitle>
              </SheetHeader>
              <BookingWidget />
            </SheetContent>
          </Sheet>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => changeDate(-1)}><ChevronLeft className="h-4 w-4" /></Button>
                <h2 className="text-xl font-semibold text-center w-48">{format(currentDate, 'MMMM yyyy')}</h2>
                <Button variant="outline" size="icon" onClick={() => changeDate(1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={view === 'month' ? 'default' : 'outline'} onClick={() => setView('month')}>Month</Button>
                <Button variant={view === 'week' ? 'default' : 'outline'} onClick={() => setView('week')}>Week</Button>
              </div>
            </div>
            <div className="grid grid-cols-7 border-t border-l">
              {days.slice(0, 7).map(day => (
                <div key={day.toString()} className="p-2 text-center font-medium text-muted-foreground border-b border-r text-sm">
                  {format(day, 'EEE')}
                </div>
              ))}
              {days.map((day, dayIdx) => {
                const dayKey = format(day, 'yyyy-MM-dd');
                const dayEvents = eventsByDay.get(dayKey) || [];
                return (
                  <div key={day.toString()} className="relative min-h-[120px] border-b border-r p-2 flex flex-col gap-1">
                    <span className="font-semibold">{format(day, 'd')}</span>
                    {isLoading ? (
                      <Skeleton className="h-5 w-full rounded" />
                    ) : (
                      dayEvents.slice(0, 3).map(event => (
                        <motion.div
                          key={event.id}
                          layoutId={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-1.5 rounded-md text-xs cursor-pointer hover:opacity-80"
                          style={{ backgroundColor: event.color }}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <p className="font-semibold text-white truncate">{event.title}</p>
                        </motion.div>
                      ))
                    )}
                    {dayEvents.length > 3 && (
                      <p className="text-xs text-muted-foreground mt-1 cursor-pointer hover:underline">
                        +{dayEvents.length - 3} more
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Sheet open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
          <SheetContent>
            {selectedEvent && <AppointmentDetail appointmentId={selectedEvent.id} />}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}