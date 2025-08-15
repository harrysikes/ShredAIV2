# ShredAI UI Components

This directory contains React Native-compatible UI components inspired by shadcn/ui design system. All components are built with TypeScript and follow modern React Native best practices.

## Available Components

### 🎯 **Button**
A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '../components/ui';

<Button variant="default" size="lg" onPress={handlePress}>
  Click Me
</Button>
```

**Variants:**
- `default` - Filled black button
- `outline` - Outlined button
- `ghost` - Transparent button
- `link` - Link-style button

**Sizes:**
- `sm` - Small (32px height)
- `default` - Medium (40px height)
- `lg` - Large (48px height)

### 📊 **Progress**
A progress bar component for showing completion status.

```tsx
import { Progress } from '../components/ui';

<Progress value={75} />
```

**Props:**
- `value` - Progress percentage (0-100)
- `style` - Custom styles

### 📝 **Input**
A form input component with label and error support.

```tsx
import { Input } from '../components/ui';

<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  error="Invalid email"
/>
```

**Props:**
- `label` - Input label
- `placeholder` - Placeholder text
- `value` - Input value
- `onChangeText` - Change handler
- `error` - Error message
- `disabled` - Disabled state

### 🃏 **Card**
A container component for grouping related content.

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui';

<Card>
  <CardHeader>
    <Text>Card Title</Text>
  </CardHeader>
  <CardContent>
    <Text>Card content goes here</Text>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### 🏷️ **Badge**
A small component for displaying status or labels.

```tsx
import { Badge } from '../components/ui';

<Badge variant="default" size="sm">
  New
</Badge>
```

**Variants:**
- `default` - Black badge
- `secondary` - Gray badge
- `destructive` - Red badge
- `outline` - Outlined badge

### ➖ **Separator**
A visual divider component.

```tsx
import { Separator } from '../components/ui';

<Separator orientation="horizontal" />
<Separator orientation="vertical" />
```

### ⏳ **Loading**
A loading indicator component.

```tsx
import { Loading } from '../components/ui';

<Loading text="Processing..." size="large" />
```

**Props:**
- `text` - Loading message
- `size` - Spinner size ('small' | 'large')
- `style` - Custom styles

### 🚨 **Alert**
A modal alert component to replace React Native's Alert.

```tsx
import { Alert } from '../components/ui';

<Alert
  title="Confirm Action"
  message="Are you sure you want to proceed?"
  visible={showAlert}
  onClose={() => setShowAlert(false)}
  actions={[
    {
      text: "Cancel",
      onPress: () => setShowAlert(false),
      variant: "outline"
    },
    {
      text: "Confirm",
      onPress: handleConfirm,
      variant: "default"
    }
  ]}
/>
```

## Usage Examples

### Survey Form
```tsx
import { Button, Input, Card, CardContent } from '../components/ui';

<Card>
  <CardContent>
    <Input
      label="Name"
      placeholder="Enter your name"
      value={name}
      onChangeText={setName}
    />
    <Button variant="default" onPress={handleSubmit}>
      Submit
    </Button>
  </CardContent>
</Card>
```

### Progress Indicator
```tsx
import { Progress, Badge } from '../components/ui';

<View>
  <Progress value={65} />
  <Badge variant="secondary">65% Complete</Badge>
</View>
```

### Action Buttons
```tsx
import { Button, Separator } from '../components/ui';

<View>
  <Button variant="default" onPress={primaryAction}>
    Primary Action
  </Button>
  <Separator />
  <Button variant="outline" onPress={secondaryAction}>
    Secondary Action
  </Button>
  <Button variant="ghost" onPress={tertiaryAction}>
    Tertiary Action
  </Button>
</View>
```

## Styling

All components use consistent design tokens:
- **Colors**: Black (#000000), White (#FFFFFF), Gray (#6B7280)
- **Border Radius**: 6px (small), 8px (medium), 12px (large)
- **Spacing**: 8px, 16px, 24px, 32px
- **Typography**: System fonts with consistent weights

## Customization

Components accept `style` props for custom styling while maintaining the base design system. You can override specific aspects while keeping the component's structure intact.

## Accessibility

All components are built with accessibility in mind:
- Proper touch targets (minimum 44px)
- Clear visual feedback
- Semantic structure
- Screen reader support

## Performance

Components are optimized for React Native:
- Minimal re-renders
- Efficient style calculations
- Proper memoization where needed
- Lightweight implementations
