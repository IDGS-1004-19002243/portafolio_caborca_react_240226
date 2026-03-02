import { Link } from 'react-router-dom'

// ProductCard Component - Componente para mostrar productos
const ProductCard = ({
  product,
  className = '',
  size = 'default'
}) => {
  const {
    id,
    name,
    image,
    isNew = false,
    isLimited = false
  } = product

  const sizes = {
    sm: {
      container: 'text-center group',
      image: 'aspect-square w-full',
      title: 'text-sm lg:text-base',
      price: 'text-sm'
    },
    default: {
      container: 'text-center group',
      image: 'aspect-square w-full',
      title: 'text-base lg:text-lg',
    },
    lg: {
      container: 'text-center group',
      image: 'aspect-square w-full',
      title: 'text-lg lg:text-xl',
      price: 'text-lg lg:text-xl'
    }
  }

  const sizeConfig = sizes[size]

  return (
    <div className={`${sizeConfig.container} ${className}`}>
      <Link to={`/producto/${product.catalogoPadre || 'catalogo'}/${id}`} className="block">
        <div className={`relative bg-gray-100 rounded-2xl overflow-hidden ${sizeConfig.image} mb-6 lg:mb-8 border border-gray-200`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges */}
          {(isNew || isLimited) && (
            <div className="absolute top-3 right-3">
              {isNew && (
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  NUEVO
                </span>
              )}
              {isLimited && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  LIMITADO
                </span>
              )}
            </div>
          )}
        </div>
        <h3 className={`${sizeConfig.title} font-bold tracking-wide text-caborca-cafe mb-3 uppercase`}>
          {name}
        </h3>
      </Link>
    </div>
  )
}

export default ProductCard