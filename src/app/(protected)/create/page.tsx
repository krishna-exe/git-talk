'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormInput = {
    repoUrl: string;
    projectName: string;
    githubToken?: string;
};

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation();

    function onSubmit(data: FormInput) {
        createProject.mutateAsync(
            {
                githubUrl: data.repoUrl,
                name: data.projectName,
                githubToken: data.githubToken
            },
            {
                onSuccess: () => {
                    toast.success('Project created successfully');
                    reset();
                },
                onError: (error) => {
                    toast.error('Error creating project');
                }
            }
        );
        return true;
    }

    return (
        <div className="flex items-center gap-12 h-full justify-center">
            <img src="/undraw_svg.svg" alt="logo" className="w-auto h-56" />
            <div>
                <div>
                    <h1 className="font-semibold text-2xl">Link your GitHub repo</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter the link to your repo to link it to Git-Talk!
                    </p>
                </div>
                <div className="h-4"></div>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            required
                            {...register('projectName')}
                            placeholder="Project Name"
                        />
                        <div className="h-2"></div>
                        <Input
                            required
                            {...register('repoUrl')}
                            placeholder="Repository URL"
                            type  = 'url'
                        />
                        <div className="h-2"></div>
                        <Input
                            {...register('githubToken')}
                            placeholder="GitHub Token (optional)"
                        />
                        <div className="h-2"></div>
                        <Button type="submit">
                            Create Project
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePage;