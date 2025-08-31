# Next.js Student Portal Application Template

## Overview
This template captures the architectural patterns, conventions, and best practices used in a production-ready student portal application built with Next.js 15, TypeScript, and modern React patterns.

Use this template to generate future projects based on any domain.

## 🏗️ Project Architecture

### Tech Stack Foundation
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript with strict configuration
- **UI Library**: Material-UI (MUI) v7.2.0 with Next.js integration
- **Styling**: Tailwind CSS v4.1.11 + CSS variables for theming
- **State Management**: TanStack React Query v5.83.0 with persistence
- **HTTP Client**: Axios with interceptors
- **Validation**: Zod v4.0.17 (migrated from Yup)
- **Forms**: Manual validation (current) + React Hook Form (recommended)
- **Testing**: Jest + React Testing Library
- **Fonts**: Inter font family
- **Authentication**: JWT with Role-Based Access Control (RBAC)
- **Internationalization**: Multi-language support
- **Code Templates**: Reusable patterns in gen_code/ folder

### Directory Structure
```
src/
├── app/                          # Next.js App Router
│   ├── components/               # Shared components
│   │   ├── [Component]/          # Component folders with tests
│   │   │   ├── Component.tsx
│   │   │   ├── Component.test.tsx
│   │   │   └── index.ts         # Barrel exports
│   │   └── GlobalSnackbar/      # Context-based notifications
│   ├── [feature]/               # Feature-based routing
│   │   ├── api/                 # API layer
│   │   ├── components/          # Feature components
│   │   ├── hooks/               # Custom hooks
│   │   ├── types/               # Feature types
│   │   ├── utils/               # Feature utilities
│   │   ├── layout.tsx           # Feature layout
│   │   ├── loading.tsx          # Loading UI
│   │   └── page.tsx            # Page component
│   ├── providers/               # Context providers
│   ├── types/                   # Global types
│   ├── utils/                   # Global utilities
│   ├── i18n/                    # Internationalization
│   │   ├── locales/             # Translation files
│   │   ├── hooks/               # i18n hooks
│   │   └── utils/               # i18n utilities
│   ├── auth/                    # Authentication & RBAC
│   │   ├── components/          # Auth components
│   │   ├── hooks/               # Auth hooks
│   │   ├── utils/               # Auth utilities
│   │   └── types/               # Auth types
│   └── globals.css              # Global styles + CSS variables
├── gen_code/                    # Code generation templates
│   ├── components/              # Reusable component templates
│   ├── hooks/                   # Custom hooks templates
│   ├── providers/               # Context providers and wrappers
│   ├── integrations/            # Third-party integrations (maps, charts, auth)
│   ├── patterns/                # Common architectural patterns (CRUD, real-time)
│   └── utils/                   # Utility functions and helpers
```

## 🧩 Component Architecture

### Component Design Patterns

#### 1. Extensible Button Components
Components extend MUI base components with consistent patterns:

```typescript
interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
  variant?: "contained" | "outlined";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  "data-testid"?: string;  // Always include for testing
}

export default function CustomButton({ children, icon, ...props }: CustomButtonProps) {
  return (
    <Button
      variant={props.variant || "contained"}
      {...props}
      sx={{
        // CSS variables for theming
        backgroundColor: "var(--color-primary)",
        // Responsive design with MUI breakpoints
        fontSize: { xs: "0.875rem", md: "1rem" },
        // Spread props.sx for extensibility
        ...props.sx,
      }}
      startIcon={icon}
      disabled={props.disabled || props.loading}
      data-testid={props["data-testid"] || "default-testid"}
    >
      {props.loading ? (
        <CircularProgress size={20} sx={{ color: "white" }} />
      ) : (
        children
      )}
    </Button>
  );
}
```

#### 2. Compound Components
Complex features use compound component patterns:

```typescript
// QuizContainer manages state and coordinates child components
export default function QuizContainer({ stageId }: QuizContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, QuizAnswer>>({});
  
  // Custom hooks for data and business logic
  const quizData = useQuizData(stageId);
  const quizSubmission = useQuizSubmission();
  const { timeLeft, getTimeDisplay } = useQuizTimer({
    initialTimeInMinutes: quizData.timeLimit || 15,
    onTimeUp: handleTimeUp,
    autoStart: true
  });

  return (
    <div>
      <QuestionPagination {...paginationProps} />
      <QuestionCard {...questionProps} />
      {/* Navigation buttons */}
    </div>
  );
}
```

### 3. Real-World UI Component Examples

#### Modal/Dialog Components
Based on the project's actual implementation pattern:

```typescript
// src/app/components/Dialog/ConfirmationDialog.tsx
interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  content: string;
  confirmButtonText?: string;
  onClose: () => void;
  onConfirm: () => void;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export default function ConfirmationDialog({
  open,
  title,
  content,
  confirmButtonText = 'Confirm',
  onClose,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Usage example from StageSubmissionBar component
interface SubmissionConfig {
  title: string;
  description: string;
  buttonText: string;
  dialogTitle: string;
  dialogContent: string;
  confirmButtonText: string;
  successMessage: string;
}

const SUBMISSION_CONFIGS: Record<string, SubmissionConfig> = {
  quiz: {
    title: "Stage Evaluation",
    description: "This quiz will test your knowledge of the stage.",
    buttonText: "Attempt Quiz",
    dialogTitle: "Confirm Quiz Submission",
    dialogContent: "Are you sure you want to attempt this quiz? Once started, you'll need to complete it.",
    confirmButtonText: "Start Quiz",
    successMessage: "Quiz started successfully"
  }
};

// Component using the dialog
function ComponentWithDialog() {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const config = SUBMISSION_CONFIGS.quiz;

  const handleConfirmSubmission = () => {
    setConfirmationOpen(false);
    // Process submission
  };

  return (
    <>
      <Button onClick={() => setConfirmationOpen(true)}>
        {config.buttonText}
      </Button>
      
      <ConfirmationDialog
        open={confirmationOpen}
        title={config.dialogTitle}
        content={config.dialogContent}
        confirmButtonText={config.confirmButtonText}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleConfirmSubmission}
      />
    </>
  );
}
```

#### Form Components with Validation

The project uses different validation approaches. Here are the main patterns:

##### 1. Current Project Pattern (Manual Validation with Zod)
```typescript
// Current implementation pattern from SendOTPCard
import { TextField } from "@mui/material";
import { useState } from "react";
import { phoneNumberSchema } from "../../utils/schemas"; // Zod schema

export default function PhoneNumberForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const formatPhoneNumber = (value: string): string => {
    return value.replace(/[^0-9]/g, "").slice(0, 10);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedPhoneNumber = formatPhoneNumber(value);
    setPhoneNumber(formattedPhoneNumber);

    // Clear error when user is typing
    if (error) setError("");
  };

  const validatePhoneNumber = async (): Promise<boolean> => {
    try {
      phoneNumberSchema.parse({ phoneNumber });
      setError("");
      return true;
    } catch (validationError) {
      if (validationError instanceof Error) {
        setError(validationError.message);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    const isValid = await validatePhoneNumber();
    if (!isValid) return;
    // Process form
  };

  return (
    <div>
      <TextField
        placeholder="Enter your phone number"
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        error={!!error}
        helperText={error}
        sx={{
          '& .MuiInputBase-input': {
            padding: ".5rem 1rem",
            fontSize: ".8rem",
          },
        }}
      />
      <Button 
        disabled={!phoneNumber || phoneNumber.length < 10 || !!error}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </div>
  );
}
```

##### 2. Enhanced Pattern with React Hook Form + Zod (Recommended)
```typescript
// Recommended modern approach
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Button, Box } from '@mui/material';

// Zod schema (already exists in project)
const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .refine((value) => ['6', '7', '8', '9'].includes(value[0]), {
      message: 'Phone number must start with 6, 7, 8, or 9'
    })
});

type PhoneNumberFormData = z.infer<typeof phoneNumberSchema>;

export default function ModernPhoneNumberForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<PhoneNumberFormData>({
    resolver: zodResolver(phoneNumberSchema),
    mode: 'onChange'
  });

  const phoneNumber = watch('phoneNumber', '');

  const formatPhoneNumber = (value: string): string => {
    return value.replace(/[^0-9]/g, "").slice(0, 10);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue('phoneNumber', formatted, { shouldValidate: true });
  };

  const onSubmit = async (data: PhoneNumberFormData) => {
    // Form data is already validated by Zod
    console.log('Valid form data:', data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('phoneNumber')}
        placeholder="Enter your phone number"
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber?.message}
        fullWidth
        sx={{
          '& .MuiInputBase-input': {
            padding: ".5rem 1rem",
            fontSize: ".8rem",
          },
        }}
      />
      <Button 
        type="submit"
        disabled={isSubmitting || !!errors.phoneNumber}
        variant="contained"
        sx={{ mt: 2 }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </Box>
  );
}
```

##### 3. Reusable Form Field Component
```typescript
// Enhanced form field component with React Hook Form integration
interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  formatter?: (value: string) => string;
  control: Control<any>;
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  multiline = false,
  rows = 4,
  formatter,
  control,
}: FormFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          multiline={multiline}
          rows={multiline ? rows : undefined}
          error={!!error}
          helperText={error?.message}
          fullWidth
          onChange={(e) => {
            const value = formatter ? formatter(e.target.value) : e.target.value;
            field.onChange(value);
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: disabled ? 'var(--color-ct-background)' : 'white',
            },
          }}
        />
      )}
    />
  );
}

// Usage with form
function UserProfileForm() {
  const form = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
    }
  });

  return (
    <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        name="name"
        label="Full Name"
        placeholder="Enter your full name"
        control={form.control}
        required
      />
      <FormField
        name="phoneNumber"
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number"
        control={form.control}
        formatter={formatPhoneNumber}
        required
      />
    </Box>
  );
}
```

##### 4. Form Libraries Integration

**Package.json additions for modern forms:**
```json
{
  "dependencies": {
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^4.0.17" // Already in project
  }
}
```

**Alternative libraries to consider:**
- **Formik**: Mature, feature-rich (heavier bundle)
- **React Hook Form**: Modern, performant (recommended)
- **React Final Form**: Subscription-based rendering
- **Mantine Form**: If using Mantine UI

#### Data Display Components
```typescript
// src/app/components/DataDisplay/StatCard.tsx
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  loading?: boolean;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  loading = false,
  onClick,
  color = 'primary'
}: StatCardProps) {
  const colorMap = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-ct-violet-300)',
    success: 'var(--color-ct-green)',
    warning: 'var(--color-ct-orange)',
    error: 'var(--color-ct-red)',
    info: 'var(--color-ct-blue-light)',
  };

  return (
    <Card 
      sx={{ 
        p: 3, 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        } : {},
      }}
      onClick={onClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          
          {loading ? (
            <Skeleton variant="text" width="60%" height={40} />
          ) : (
            <Typography variant="h4" sx={{ fontWeight: 600, color: colorMap[color] }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
          )}
          
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
          
          {trend && !loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {trend.isPositive ? (
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
              ) : (
                <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16 }} />
              )}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: trend.isPositive ? 'success.main' : 'error.main',
                  ml: 0.5 
                }}
              >
                {Math.abs(trend.value)}% {trend.period}
              </Typography>
            </Box>
          )}
        </Box>
        
        {icon && (
          <Box 
            sx={{ 
              backgroundColor: `${colorMap[color]}20`,
              borderRadius: '50%',
              p: 1.5,
              color: colorMap[color]
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Card>
  );
}

// Usage example with real data
export function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          subtitle="Active learners"
          icon={<PeopleIcon />}
          trend={stats?.studentsGrowth}
          loading={isLoading}
          color="primary"
          onClick={() => router.push('/students')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Quiz Completion"
          value={`${stats?.quizCompletionRate || 0}%`}
          subtitle="This month"
          icon={<QuizIcon />}
          trend={stats?.quizTrend}
          loading={isLoading}
          color="success"
        />
      </Grid>
      {/* More stat cards */}
    </Grid>
  );
}
```

#### Navigation Components
```typescript
// src/app/components/Navigation/Breadcrumbs.tsx
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
}

export default function Breadcrumbs({ 
  items, 
  separator = <ChevronRightIcon />, 
  maxItems = 4 
}: BreadcrumbsProps) {
  const { t } = useTranslation();
  
  // Collapse breadcrumbs if too many items
  const displayItems = items.length > maxItems 
    ? [
        items[0], 
        { label: '...', href: undefined },
        ...items.slice(-2)
      ]
    : items;

  return (
    <MUIBreadcrumbs 
      separator={separator}
      sx={{ 
        mb: 2,
        '& .MuiBreadcrumbs-ol': {
          alignItems: 'center',
        }
      }}
    >
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const isEllipsis = item.label === '...';
        
        if (isEllipsis) {
          return (
            <Typography key="ellipsis" color="text.secondary">
              ...
            </Typography>
          );
        }
        
        if (isLast || !item.href) {
          return (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {item.icon}
              <Typography color={isLast ? 'primary' : 'text.primary'}>
                {item.label}
              </Typography>
            </Box>
          );
        }

        return (
          <Link 
            key={index}
            href={item.href}
            style={{ 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: 'inherit'
            }}
          >
            {item.icon}
            <Typography 
              sx={{ 
                '&:hover': { 
                  textDecoration: 'underline' 
                } 
              }}
            >
              {item.label}
            </Typography>
          </Link>
        );
      })}
    </MUIBreadcrumbs>
  );
}

// Auto-generating breadcrumbs from route
export function AutoBreadcrumbs() {
  const pathname = usePathname();
  const { t } = useTranslation();
  
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: t('navigation.home'), href: '/', icon: <HomeIcon /> },
    ...pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const isLast = index === pathSegments.length - 1;
      
      return {
        label: t(`navigation.${segment}`) || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : href,
        active: isLast,
      };
    })
  ];

  return <Breadcrumbs items={breadcrumbItems} />;
}
```

#### Loading and Empty States
```typescript
// src/app/components/States/LoadingState.tsx
interface LoadingStateProps {
  type?: 'skeleton' | 'spinner' | 'custom';
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  rows?: number; // For skeleton type
  customLoader?: React.ReactNode;
}

export default function LoadingState({
  type = 'skeleton',
  message = 'Loading...',
  size = 'medium',
  fullScreen = false,
  rows = 3,
  customLoader
}: LoadingStateProps) {
  const sizeMap = {
    small: { spinner: 20, skeleton: 40 },
    medium: { spinner: 40, skeleton: 60 },
    large: { spinner: 60, skeleton: 80 }
  };

  const containerSx = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 2,
    p: 4,
    ...(fullScreen && {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      zIndex: 9999,
    })
  };

  const renderLoader = () => {
    if (customLoader) return customLoader;
    
    switch (type) {
      case 'spinner':
        return <CircularProgress size={sizeMap[size].spinner} />;
      
      case 'skeleton':
        return (
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            {Array.from({ length: rows }).map((_, index) => (
              <Skeleton 
                key={index}
                variant="rectangular" 
                height={sizeMap[size].skeleton}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        );
      
      default:
        return <CircularProgress size={sizeMap[size].spinner} />;
    }
  };

  return (
    <Box sx={containerSx}>
      {renderLoader()}
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}

// src/app/components/States/EmptyState.tsx
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
  };
  illustration?: string; // URL to illustration image
}

export default function EmptyState({
  title,
  description,
  icon = <InboxIcon />,
  action,
  illustration
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 4,
      }}
    >
      {illustration ? (
        <Box
          component="img"
          src={illustration}
          alt="Empty state"
          sx={{
            width: { xs: 200, md: 300 },
            height: 'auto',
            mb: 3,
            opacity: 0.6,
          }}
        />
      ) : (
        <Box
          sx={{
            fontSize: { xs: 60, md: 80 },
            color: 'text.disabled',
            mb: 3,
          }}
        >
          {icon}
        </Box>
      )}
      
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: 'text.primary' 
        }}
      >
        {title}
      </Typography>
      
      {description && (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 4, maxWidth: 400 }}
        >
          {description}
        </Typography>
      )}
      
      {action && (
        <Button
          variant={action.variant || 'contained'}
          onClick={action.onClick}
          size="large"
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
}
```

## 📊 State Management Patterns

### 1. React Query Configuration
Centralized data fetching with persistence:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

// Selective persistence for performance
const whiteListedQueries = ["userCache", "messageCache"];
```

### 2. Custom Hooks Pattern
Business logic encapsulated in custom hooks:

```typescript
export const useQuizSubmission = () => {
  const { show } = useGlobalSnackbar();
  
  return useMutation({
    mutationFn: submitQuiz,
    onSuccess: (result) => {
      show(`Quiz submitted! Score: ${result.score}/${result.totalQuestions}`, "success");
    },
    onError: () => {
      show("Failed to submit quiz. Please try again.", "error");
    }
  });
};
```

## 🔗 API Integration Architecture

### HTTP Client Setup
Axios with comprehensive interceptor patterns:

```typescript
const api = axios.create({
  timeout: 10000,
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 403) {
      localStorage.removeItem("token");
      // Handle unauthorized access
    }
    return Promise.reject(error);
  }
);
```

### API Layer Organization
Feature-based API organization with consistent patterns:

```typescript
// src/app/quiz/api/index.ts
const QUIZ_API_BASE = "/api/quiz";

export const getQuizData = async (stageId: number): Promise<QuizData> => {
  const response = await api.get(`${QUIZ_API_BASE}/stage/${stageId}`);
  return response.data;
};

export const submitQuiz = async (submission: QuizSubmission): Promise<QuizResult> => {
  // Include mock implementation during development
  // const response = await api.post(`${QUIZ_API_BASE}/submit`, submission);
  // return response.data;
};
```

## 🎯 Type Safety Best Practices

### 1. Comprehensive Type Definitions
Feature-specific type organization:

```typescript
// src/app/quiz/types/index.ts
export interface QuizQuestion {
  id: number;
  question: string;
  choices: string[];
  correctAnswer?: number; // Optional for security
}

export interface QuizAnswer {
  questionId: number;
  selectedChoice: number;
  answered: boolean;
  markedForReview?: boolean;
}

export type QuestionStatus = 'unanswered' | 'answered' | 'marked' | 'answered-marked';
```

### 2. Zod Schema Validation
Runtime type validation with Zod:

```typescript
import { z } from 'zod';

export const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .refine((value) => ['6', '7', '8', '9'].includes(value[0]), {
      message: 'Phone number must start with 6, 7, 8, or 9'
    })
});

// Type inference from schemas
export type PhoneNumberFormData = z.infer<typeof phoneNumberSchema>;
```

### 3. Global Response Patterns
Consistent API response typing:

```typescript
export const globalResponseSchema = z.object({
  status: z.enum(["success", "failure"]),
  message: z.string().optional(),
});

export type GlobalResponseType = z.infer<typeof globalResponseSchema>;
```

## 🎨 Styling & Theming Architecture

### 1. CSS Variables System
Centralized design tokens:

```css
:root {
  /* Primary Colors */
  --color-primary: #8f61B0;
  --color-primary-contrast: #ffffff;
  --color-primary-300: #9F77BB;
  
  /* Component-specific tokens */
  --color-ct-background: #F6F2F9;
  --color-ct-primary-border: #E4D6ED;
  
  /* Text colors */
  --color-ct-text-neutral: #333333;
  --color-ct-text-neutral-300: #666666;
  
  /* Shadows */
  --shadow-spread-md: 0px 4px 0px 2px rgba(255, 255, 255, 0.4);
}
```

### 2. MUI Theme Integration
Minimal MUI theme with CSS variables:

```typescript
export const theme = createTheme({
  cssVariables: true, // Enable CSS variables integration
  typography: {
    fontSize: 14,
    fontFamily: "Inter",
  },
});
```

### 3. Custom Scrollbar Styling
Consistent scrollbar design:

```css
::-webkit-scrollbar {
  width: 5px;
  background: #ffffff00;
}

::-webkit-scrollbar-thumb {
  background-color: var(--color-ct-violet-300);
}
```

### 4. Responsive Design Patterns
Mobile-first responsive approach:

```typescript
sx={{
  fontSize: { xs: "0.875rem", md: "1rem" },
  padding: { xs: 2, sm: 3, md: 4, lg: 6 },
  minWidth: { xs: "80px", md: "120px" },
}}
```

## 🧪 Testing Architecture

### Jest Configuration
Comprehensive testing setup:

```typescript
const config: Config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Component Testing Patterns
Test files co-located with components:

```typescript
// Component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component data-testid="component" />);
    expect(screen.getByTestId('component')).toBeInTheDocument();
  });
});
```

## 🚀 Provider Architecture

### App Providers Composition
Layered provider setup:

```typescript
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalSnackbarProvider>
            {children}
          </GlobalSnackbarProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </QueryProvider>
  );
}
```

## 📋 Development Workflow

### Package Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  }
}
```

### ESLint Configuration
TypeScript-specific rules:

```javascript
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/ban-ts-comment": "off"
    },
  },
];
```

## 🔧 Configuration Files

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tailwind Configuration
Custom shadows and variants:

```javascript
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'stage-card': '0px 40px 11px 0px rgba(194, 177, 205, 0.00)...',
        'team-hub': '0px 3px 0px 4px var(--Colors-Violet-1, #E4DAEC)',
      }
    }
  },
  variants: {
    extend: {
      boxShadow: ['hover'],
    },
  },
};
```

## 📖 SEO & Metadata

### Comprehensive Metadata Setup
```typescript
export const metadata: Metadata = {
  title: "AI Mentor - Student Portal | Interactive Learning & Assessment",
  description: "Comprehensive student portal...",
  keywords: ["AI mentor", "student portal", "online learning"],
  openGraph: {
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
  verification: { google: "verification-code" },
};
```

## 🎯 Key Implementation Guidelines

### 1. Component Design
- Extend MUI components rather than wrapping
- Always include `data-testid` props for testing
- Use TypeScript interfaces that extend base component props
- Implement loading states for async operations

### 2. State Management
- Use React Query for server state
- Implement custom hooks for business logic
- Use context sparingly, prefer prop drilling for simple cases

### 3. Styling
- CSS variables for theming over hardcoded values
- Mobile-first responsive design
- Co-locate component-specific styles when needed

### 4. Type Safety
- Zod for runtime validation
- Strict TypeScript configuration
- Feature-based type organization

### 5. Testing
- High coverage thresholds (80%+)
- Co-locate test files with components
- Mock external dependencies consistently

## 🔐 Authentication & Authorization (RBAC)

### Role-Based Access Control Architecture

#### Permission System
```typescript
// src/app/auth/types/index.ts
export interface Permission {
  resource: string; // 'quiz', 'dashboard', 'admin'
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
  conditions?: Record<string, any>; // Optional conditions
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  roles: Role[];
  permissions?: Permission[]; // Direct permissions override roles
}
```

#### JWT Token Management
```typescript
// src/app/auth/utils/tokenManager.ts
interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<TokenPair> | null = null;

  static getInstance(): TokenManager {
    if (!this.instance) {
      this.instance = new TokenManager();
    }
    return this.instance;
  }

  async getValidToken(): Promise<string> {
    const tokens = this.getStoredTokens();
    
    if (this.isTokenExpired(tokens.accessToken)) {
      return this.refreshAccessToken();
    }
    
    return tokens.accessToken;
  }

  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh calls
    if (!this.refreshPromise) {
      this.refreshPromise = this.performTokenRefresh();
    }
    
    const newTokens = await this.refreshPromise;
    this.refreshPromise = null;
    this.storeTokens(newTokens);
    return newTokens.accessToken;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
```

#### Protected Route Components
```typescript
// src/app/auth/components/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions: Permission[];
  fallback?: React.ReactNode;
  requireAll?: boolean; // true: require ALL permissions, false: require ANY
}

export default function ProtectedRoute({
  children,
  requiredPermissions,
  fallback = <UnauthorizedAccess />,
  requireAll = false
}: ProtectedRouteProps) {
  const { user, hasPermissions } = useAuth();
  
  if (!user) {
    return <LoginRedirect />;
  }

  const hasAccess = requireAll
    ? hasPermissions(requiredPermissions) // All permissions required
    : requiredPermissions.some(permission => hasPermissions([permission])); // Any permission

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
}

// Higher-Order Component for permission-based access
export function withPermissions(requiredPermissions: Permission[]) {
  return function<P extends object>(Component: React.ComponentType<P>) {
    return function ProtectedComponent(props: P) {
      return (
        <ProtectedRoute requiredPermissions={requiredPermissions}>
          <Component {...props} />
        </ProtectedRoute>
      );
    };
  };
}
```

#### Authentication Hook
```typescript
// src/app/auth/hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const hasPermissions = useCallback((requiredPermissions: Permission[]): boolean => {
    if (!user) return false;

    // Combine role permissions with direct user permissions
    const allPermissions = [
      ...user.roles.flatMap(role => role.permissions),
      ...(user.permissions || [])
    ];

    return requiredPermissions.every(required => 
      allPermissions.some(permission => 
        permission.resource === required.resource && 
        permission.action === required.action &&
        matchesConditions(permission.conditions, required.conditions)
      )
    );
  }, [user]);

  const hasRole = useCallback((roleName: string): boolean => {
    return user?.roles.some(role => role.name === roleName) || false;
  }, [user]);

  const login = async (credentials: LoginCredentials) => {
    const response = await authAPI.login(credentials);
    const tokens = response.tokens;
    const userData = response.user;
    
    TokenManager.getInstance().storeTokens(tokens);
    setUser(userData);
  };

  const logout = () => {
    TokenManager.getInstance().clearTokens();
    setUser(null);
  };

  return {
    user,
    loading,
    hasPermissions,
    hasRole,
    login,
    logout,
  };
};
```

## 🌍 Internationalization (i18n)

### Multi-Language Support Architecture

#### Locale Configuration
```typescript
// src/app/i18n/types/index.ts
export interface Locale {
  code: string; // 'en', 'ta', 'hi'
  name: string; // 'English', 'Tamil', 'Hindi'
  nativeName: string; // 'English', 'தமிழ்', 'हिंदी'
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  numberFormat: Intl.NumberFormatOptions;
}

// src/app/i18n/locales/index.ts
export const supportedLocales: Record<string, Locale> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD',
    numberFormat: { notation: 'standard' }
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    currency: 'INR',
    numberFormat: { notation: 'standard' }
  }
};
```

#### Translation Management
```typescript
// src/app/i18n/locales/en/common.json
{
  "navigation": {
    "dashboard": "Dashboard",
    "quiz": "Quiz",
    "profile": "Profile",
    "logout": "Logout"
  },
  "common": {
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "loading": "Loading...",
    "error": "An error occurred",
    "success": "Operation completed successfully"
  },
  "quiz": {
    "startQuiz": "Start Quiz",
    "submitQuiz": "Submit Quiz",
    "timeRemaining": "Time Remaining: {{time}}",
    "questionOf": "Question {{current}} of {{total}}",
    "markForReview": "Mark for Review",
    "nextQuestion": "Next Question",
    "previousQuestion": "Previous Question"
  }
}

// src/app/i18n/locales/ta/common.json
{
  "navigation": {
    "dashboard": "முதன்மை பலகை",
    "quiz": "வினாடிவினா",
    "profile": "சுயவிவரம்",
    "logout": "வெளியேறு"
  },
  "common": {
    "submit": "சமர்ப்பிக்கவும்",
    "cancel": "ரத்து செய்",
    "save": "சேமிக்கவும்",
    "delete": "அழிக்கவும்",
    "edit": "திருத்து"
  }
}
```

#### Translation Hooks
```typescript
// src/app/i18n/hooks/useTranslation.ts
export const useTranslation = () => {
  const { locale } = useLocale();
  
  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const translation = getNestedTranslation(locale, key);
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in locale: ${locale}`);
      return key;
    }

    // Handle interpolation {{param}}
    if (params) {
      return Object.entries(params).reduce(
        (str, [param, value]) => str.replace(new RegExp(`{{${param}}}`, 'g'), String(value)),
        translation
      );
    }

    return translation;
  }, [locale]);

  // Pluralization support
  const tp = useCallback((
    key: string, 
    count: number, 
    params?: Record<string, string | number>
  ) => {
    const pluralKey = count === 1 ? `${key}.one` : `${key}.other`;
    return t(pluralKey, { ...params, count });
  }, [t]);

  return { t, tp };
};

// Format utilities hook
export const useFormatting = () => {
  const { locale } = useLocale();
  const localeConfig = supportedLocales[locale];

  const formatCurrency = useCallback((amount: number, currency?: string) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || localeConfig.currency,
    }).format(amount);
  }, [locale, localeConfig]);

  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    }).format(date);
  }, [locale]);

  const formatRelativeTime = useCallback((date: Date) => {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const diffInSeconds = (date.getTime() - Date.now()) / 1000;
    
    if (Math.abs(diffInSeconds) < 60) return rtf.format(Math.round(diffInSeconds), 'second');
    if (Math.abs(diffInSeconds) < 3600) return rtf.format(Math.round(diffInSeconds / 60), 'minute');
    if (Math.abs(diffInSeconds) < 86400) return rtf.format(Math.round(diffInSeconds / 3600), 'hour');
    return rtf.format(Math.round(diffInSeconds / 86400), 'day');
  }, [locale]);

  return { formatCurrency, formatDate, formatRelativeTime };
};
```


#### Locale Context Provider
```typescript
// src/app/i18n/providers/LocaleProvider.tsx
interface LocaleContextValue {
  locale: string;
  setLocale: (locale: string) => void;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load locale from localStorage or browser preference
    const savedLocale = localStorage.getItem('preferred-locale');
    const browserLocale = navigator.language.split('-')[0];
    const initialLocale = savedLocale || 
      (supportedLocales[browserLocale] ? browserLocale : 'en');
    
    setLocaleState(initialLocale);
    setIsLoading(false);
  }, []);

  const setLocale = useCallback((newLocale: string) => {
    if (supportedLocales[newLocale]) {
      setLocaleState(newLocale);
      localStorage.setItem('preferred-locale', newLocale);
      document.documentElement.lang = newLocale;
    }
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isLoading }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
};
```

## 🎯 Code Generation Templates (gen_code/)

The `gen_code/` folder contains reusable code templates and examples for common patterns:

### Structure
```
gen_code/
├── components/              # UI Component Templates
│   ├── forms/              # Form components with validation
│   ├── data-display/       # Charts, tables, stat cards
│   ├── navigation/         # Breadcrumbs, sidebars, tabs
│   ├── feedback/           # Modals, toasts, alerts
│   └── states/             # Loading, empty, error states
├── hooks/                  # Custom Hook Templates
│   ├── useLocalStorage.ts  # Persistent state management
│   ├── useDebounce.ts      # Input debouncing
│   └── useInfiniteScroll.ts # Pagination patterns
├── providers/              # Context Provider Templates
│   ├── ThemeProvider.tsx   # Theme management
│   └── NotificationProvider.tsx # Global notifications
├── integrations/           # Third-Party Integration Wrappers
│   ├── maps/               # OpenLayers map integration
│   │   ├── MapProvider.tsx # Global map context
│   │   ├── useLayers.ts    # Layer management hook
│   │   └── MapContainer.tsx # Map display component
│   ├── charts/             # Chart library wrappers
│   └── auth/               # Authentication providers
├── patterns/               # Architectural Patterns
│   ├── crud/               # CRUD operations templates
│   │   ├── useCrudOperations.ts # Generic CRUD hook
│   │   └── CrudTable.tsx   # Data table with CRUD
│   ├── real-time/          # WebSocket/SSE patterns
│   └── file-upload/        # File handling patterns
└── utils/                  # Utility Function Templates
    ├── api.ts              # API client utilities
    ├── validation.ts       # Common validation schemas
    └── formatters.ts       # Data formatting utilities
```

### Key Templates Available

#### Map Integration (OpenLayers)
- **MapProvider**: Global map context with base layer management
- **useLayers**: Hook for vector layer operations (add, remove, zoom)
- **MapContainer**: Responsive map component with controls

#### CRUD Operations
- **useCrudOperations**: Complete CRUD hook with form management
- **CrudTable**: Data table with inline editing and bulk operations
- **FormBuilder**: Dynamic form generation from schemas

#### Real-time Features
- **useWebSocket**: WebSocket connection management
- **useServerSentEvents**: SSE for live updates
- **useRealTimeSync**: Optimistic updates with conflict resolution

### Usage Philosophy
Templates are designed to be:
- **Copy-paste ready**: Minimal configuration required
- **Fully typed**: Complete TypeScript definitions
- **Modular**: Easy to extract specific parts
- **Documented**: Extensive usage examples included
- **Test-friendly**: Built with testing in mind

Each template includes comprehensive examples showing integration with the main application architecture, ensuring consistency with established patterns.

This template provides a solid foundation for building scalable, maintainable Next.js applications with modern React patterns, comprehensive TypeScript integration, enterprise-grade authentication, and multi-language support.