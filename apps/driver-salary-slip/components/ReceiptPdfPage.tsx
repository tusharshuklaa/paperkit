import type { ReceiptData } from '@driver/lib/driver-salary-slip/receipt-data';
import { Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import revenueStamp from '../public/revenue.jpg';

Font.register({
  family: 'Receipt Emphasis',
  src: new URL(
    '@fontsource/noto-sans-devanagari/files/noto-sans-devanagari-latin-700-normal.woff',
    import.meta.url,
  ).href,
});

type ReceiptPdfPageProps = {
  data: ReceiptData;
  fontFamilies: string[];
};

const styles = StyleSheet.create({
  page: { padding: 45.35, paddingTop: 51.35, fontSize: 10.5, lineHeight: 1.6, color: '#222c26' },
  header: { paddingBottom: 6, borderBottom: '0.75pt solid #dce2dc' },
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 15,
    lineHeight: 1.28,
  },
  heading: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    textAlign: 'center',
  },
  split: { borderTop: '1.5pt solid #dce2dc', marginTop: 16, paddingTop: 18 },
  acknowledgement: { marginTop: 42 },
  paragraph: { marginTop: 10 },
  acknowledgementParagraph: { marginBottom: 10 },
  fields: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 9, marginTop: 13.5 },
  compactFields: { marginTop: 21 },
  field: { width: '50%', paddingRight: 12 },
  label: { fontSize: 8.25, color: '#5a625d' },
  fieldLabel: { marginBottom: 2.25 },
  signoff: { textAlign: 'right', marginTop: 10 },
  driverSignoff: { textAlign: 'right', marginTop: 16.5 },
  footer: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 18, minHeight: 69 },
  footerColumn: { flexBasis: 0, flexGrow: 1 },
  stamp: { marginRight: 12, gap: 4.5 },
  stampLabel: { fontFamily: 'Helvetica-Bold', fontSize: 9 },
  stampImage: { width: 36, height: 43.5, objectFit: 'contain' },
  signature: { width: 84, textAlign: 'center' },
  signatureSlot: { minHeight: 46.5, borderBottom: '0.75pt solid #dce2dc', paddingBottom: 1.5 },
  signatureImage: { width: '100%', height: 46.5, objectFit: 'contain' },
  signatureLabel: { marginTop: 1.5 },
});

function ReceiptFields({
  fields,
  compact = false,
}: { fields: [string, string][]; compact?: boolean }) {
  return (
    <View style={compact ? [styles.fields, styles.compactFields] : styles.fields} wrap={false}>
      {fields.map(([label, value]) => (
        <View key={label} style={styles.field}>
          <Text style={[styles.label, styles.fieldLabel]}>{label.toUpperCase()}</Text>
          <Text>{value}</Text>
        </View>
      ))}
    </View>
  );
}

export function ReceiptPdfPage({ data, fontFamilies }: ReceiptPdfPageProps) {
  const driver = `${data.driverSalutation} ${data.driverName}`;
  const payer = `${data.payerSalutation} ${data.payerName}`;
  const month = data.salaryMonth;
  const date = data.paymentDateLabel;
  const vehicle = data.vehicleNumber.toUpperCase();
  const emphasis = { fontFamily: 'Receipt Emphasis' };
  const emphasize = (value: string) =>
    /^[ -~]+$/.test(value) ? <Text style={emphasis}>{value}</Text> : value;
  const amount = (separator = '') => (
    <>
      {`${data.currencySymbol}${separator}`}
      {emphasize(data.salaryAmountLabel)}
    </>
  );
  const summary = (
    <>
      {'Received from '}
      {emphasize(payer)} {amount()}
      {' to driver '}
      {emphasize(driver)}
      {' towards salary of the month of '}
      {emphasize(month)}
      {'.'}
    </>
  );

  return (
    <Page size="A4" style={[styles.page, { fontFamily: fontFamilies }]}>
      <View style={styles.header} minPresenceAhead={28}>
        <Text style={styles.title}>Driver Salary Receipt</Text>
      </View>
      {data.template === '1' ? (
        <>
          <Text style={styles.paragraph}>
            {'This is to certify that I have paid '}
            {amount(' ')}
            {' to driver '}
            {emphasize(driver)}
            {' for the month of '}
            {emphasize(month)}
            {`. (Acknowledged receipt enclosed). ${data.declaration}`}
          </Text>
          <ReceiptFields
            fields={[
              ['Payer Name', data.payerName],
              ['Date', date],
            ]}
          />
          <View style={styles.split} minPresenceAhead={60}>
            <Text style={styles.heading}>Receipt Acknowledgement</Text>
          </View>
          <ReceiptFields
            fields={[
              ['Date of Receipt', date],
              ['For the Month of', month],
              ['Name of Driver', driver],
              ['Vehicle No', vehicle],
            ]}
          />
          <Text style={styles.paragraph}>
            {'Received a sum of '}
            {amount()}
            {' only for the month of '}
            {emphasize(month)}
            {' from '}
            {emphasize(payer)}
            {'.'}
          </Text>
        </>
      ) : data.template === '2' ? (
        <>
          <ReceiptFields
            fields={[
              ['Vehicle Number', vehicle],
              ['Salary of the Month', month],
              ['Amount Paid', `${data.currencySymbol}${data.salaryAmountLabel}`],
              ['Date of Receipt', date],
            ]}
          />
          <Text style={styles.paragraph}>
            {summary}
            {` ${data.declaration}`}
          </Text>
          <Text style={styles.signoff}>
            {'Payer Name: '}
            {emphasize(data.payerName)}
          </Text>
          <Text style={[styles.heading, styles.acknowledgement]} minPresenceAhead={60}>
            Receipt Acknowledgement
          </Text>
          <ReceiptFields
            fields={[
              ['Salary of the Month', month],
              ['Amount Paid', `${data.currencySymbol}${data.salaryAmountLabel}`],
              ['Date', date],
            ]}
          />
          <Text style={[styles.paragraph, styles.acknowledgementParagraph]}>{summary}</Text>
        </>
      ) : (
        <>
          <Text style={styles.paragraph}>
            {'This is to certify that '}
            {emphasize(payer)}
            {' have paid '}
            {amount()}
            {' to driver '}
            {emphasize(driver)}
            {' towards salary of the month of '}
            {emphasize(month)}
            {`. ${data.declaration}`}
          </Text>
          <ReceiptFields
            compact
            fields={[
              ['Vehicle Number', vehicle],
              ['Date', date],
              ['Driver Name', driver],
              ['Payer Name', payer],
            ]}
          />
        </>
      )}
      <View wrap={false}>
        {data.template === '2' && (
          <Text style={styles.driverSignoff}>{emphasize(`Driver Name: ${data.driverName}`)}</Text>
        )}
        <View style={styles.footer}>
          <View style={[styles.footerColumn, styles.stamp]}>
            {data.stampEnabled ? (
              <>
                <Text style={styles.stampLabel}>Revenue Stamp</Text>
                <Image src={revenueStamp.src} style={styles.stampImage} />
              </>
            ) : null}
          </View>
          <View style={styles.footerColumn}>
            <View style={styles.signature}>
              <View style={styles.signatureSlot}>
                {data.signatureImage ? (
                  <Image
                    cache={false}
                    src={data.signatureImage}
                    style={[
                      styles.signatureImage,
                      {
                        transform: `translate(${data.signatureOffsetX * 0.75}pt, ${data.signatureOffsetY * 0.75}pt) rotate(${data.signatureRotation}deg) scale(${data.signatureScale})`,
                      },
                    ]}
                  />
                ) : null}
              </View>
              <Text style={[styles.label, styles.signatureLabel]}>
                {data.signatureImage ? 'Driver signature' : 'Driver'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  );
}
