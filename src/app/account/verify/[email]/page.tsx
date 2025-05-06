import AccountVerificationClient from './AccountVerificationClient';

type Props = {
    params: Promise<{ email: string }>;
};

export default async function Page({ params }: Props) {
    return <AccountVerificationClient email={(await params).email} />;
}
