import { Badge } from '@repo/ui/Badge';
import { Button } from '@repo/ui/Button';
import { DocumentHeader } from '@repo/ui/DocumentHeader';
import { FieldWrapper } from '@repo/ui/FieldWrapper';
import { Input } from '@repo/ui/Input';
import { PaperSheet } from '@repo/ui/PaperSheet';
import { RevenueStamp } from '@repo/ui/RevenueStamp';
import { SignatureBlock } from '@repo/ui/SignatureBlock';
import { Stamp } from '@repo/ui/Stamp';
import { ToolCard, type ToolCardProps } from '@repo/ui/ToolCard';
import { Button as LegacyButton, type ButtonProps as LegacyButtonProps } from '@repo/ui/button';

const tool = {
  name: 'Example Tool',
  description: 'Synthetic public consumer fixture.',
  category: 'Example',
  format: 'PDF',
  icon: <span />,
};

const legacyProps: LegacyButtonProps = { variant: 'outline', type: 'button' };

<Button variant="primary" type="button" onClick={(event) => event.currentTarget.focus()}>
  Create
</Button>;
<Button variant="secondary" disabled>
  Save
</Button>;
<LegacyButton {...legacyProps}>Cancel</LegacyButton>;
<Badge variant="success">Live</Badge>;
<Input aria-label="Standalone input" ref={(input) => input?.focus()} />;
<FieldWrapper id="employee" label="Employee" helper="Full name" error="Enter a name">
  <Input
    name="employee"
    required
    autoComplete="name"
    onChange={(event) => event.currentTarget.checkValidity()}
  />
</FieldWrapper>;
<PaperSheet aria-label="Sample document">
  <DocumentHeader title="Sample" subtitle="Example" reference="TEST-1" />
  <SignatureBlock label="Signature" name="Example">
    Example signature
  </SignatureBlock>
  <RevenueStamp />
  <Stamp>PAID</Stamp>
</PaperSheet>;
<ToolCard {...tool} status="coming-soon" />;
<ToolCard {...tool} status="live" href="/verified-example" />;

// @ts-expect-error Live cards require a destination.
const missingDestination: ToolCardProps = { ...tool, status: 'live' };
// @ts-expect-error Coming Soon cards cannot navigate.
const unavailableDestination: ToolCardProps = { ...tool, status: 'coming-soon', href: '/example' };
void missingDestination;
void unavailableDestination;
