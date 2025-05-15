import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  onAddToCart: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        <p className="text-lg font-bold text-primary mt-2">
          {formatPrice(product.price)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => onAddToCart(product.id)}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
} 