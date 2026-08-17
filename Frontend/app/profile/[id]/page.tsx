import ProfilePage from "@/components/ProfilePage";

interface Params {
    id: string;
}

interface Props {
    params: Promise<Params>;
}

export default async function Profile({ params }: Props) {
    const { id } = await params;
    
    return (
        <div>
            <ProfilePage params={Promise.resolve({ id })} />
        </div>
    );
};