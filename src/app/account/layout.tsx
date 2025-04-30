import NavbarFixed from '@/component/NavbarFixed'

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section><NavbarFixed />{children}</section>
}