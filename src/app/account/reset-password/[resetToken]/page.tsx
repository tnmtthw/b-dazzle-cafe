import ResetPasswordCard from './ResetPasswordCard';

type Props = {
    params: Promise<{ resetToken: string }>;
};

export default async function Page({ params }: Props) {
    return <ResetPasswordCard resetToken={(await params).resetToken} />;
}
