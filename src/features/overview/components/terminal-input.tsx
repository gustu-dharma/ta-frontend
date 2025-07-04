'use client';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import axios from 'axios';

const formSchema = z.object({
  bash: z.string().min(1, { message: 'Please enter a command' }),
});

type terminalFormValue = z.infer<typeof formSchema>;

type HistoryItem = {
  command: string;
  output: string;
};

export default function TerminalForm() {
  const [loading, startTransition] = useTransition();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const defaultValues = {
    bash: '',
  };

  const form = useForm<terminalFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const runCommand = (command: string) => {
    setHistory(prev => [{ command, output: 'Running command...' }, ...prev]);

    startTransition(() => {
      axios
        .post(`${BASE_URL}/auth/run-terminal`, { bash: command })
        .then((res) => {
          const output = res.data.data || 'Command executed successfully.';
          setHistory(prev => {
            const newHistory = [...prev];
            const index = newHistory.findIndex(item => item.command === command && item.output === 'Running command...');
            if (index !== -1) {
              newHistory[index] = { command, output };
            } else {
              newHistory.unshift({ command, output });
            }
            return newHistory;
          });
        })
        .catch((error) => {
          const errorMsg = error.response?.data?.error || 'Failed to execute command.';
          toast.error('Something went wrong');
          setHistory(prev => {
            const newHistory = [...prev];
            const index = newHistory.findIndex(item => item.command === command && item.output === 'Running command...');
            if (index !== -1) {
              newHistory[index] = { command, output: errorMsg };
            } else {
              newHistory.unshift({ command, output: errorMsg });
            }
            return newHistory;
          });
        });
    });
  };

  const onSubmit = (data: terminalFormValue) => {
    runCommand(data.bash);
    form.reset();
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-1/2 space-y-2'
        >
            <h1 className='w-full text-center font-semibold italic'>TERMINAL UBUNG </h1>
          <FormField
            control={form.control}
            name='bash'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Enter command'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className='ml-auto w-full' type='submit'>
            Run Terminal
          </Button>
        </form>
      </Form>

      {history.length > 0 ? (
        <div className="mt-4 w-1/2 bg-black text-green-400 font-mono p-4 rounded-md max-h-[300px]  h-[300px] overflow-auto whitespace-pre-wrap">
          {history.map((item, idx) => (
            <div key={idx} className="mb-4">
              <div className="text-yellow-400 font-bold cursor-pointer" onClick={() => runCommand(item.command)} title="Click to run again">
                $ {item.command}
              </div>
              <pre>{item.output}</pre>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 w-1/2 bg-black text-green-400 font-mono p-4 rounded-md min-h-[300px] whitespace-pre-wrap">
          Output will appear here...
        </div>
      )}
    </>
  );
}
