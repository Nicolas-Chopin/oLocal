<?php

namespace App\Controller\Api;
use App\Entity\Catalog;
use App\Entity\Product;
use App\Form\ProductType;
use App\Repository\UserRepository;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\LocalSupplierRepository;
use App\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

class ApiProductsController extends AbstractController
{
    /**
     * @Route("/api/products", name="api_products", methods={"GET"})
     */
    public function index()
    {
        return $this->json([]);
    }

    /**
     * @Route("/api/products/add", name="api_products_add", methods={"POST"})
     */
    public function add (Request $request, ProductRepository $productRepository, CategoryRepository $categoryRepository, UserRepository $userRepository,LocalSupplierRepository $localSupplierRepository, EntityManagerInterface $em, ValidatorInterface $validator, DenormalizerInterface $denormalizer)
    {
         
        // 1. On récupère le contenu JSON
        $data = json_decode($request->getContent());

        $product = $denormalizer->denormalize($data->product, Product::class);
        
        //on valide l'entité 
        $errors = $validator->validate($product);
        if (count($errors) !== 0) {
            $jsonErrors = [];
            foreach ($errors as $error) {
                $jsonErrors[] = [
                    'field' => $error->getPropertyPath(),
                    'message' => $error->getMessage(),
                ];
            }

            return $this->json($jsonErrors, Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // on verifie si le produit n'exite pas déjà en base 

        $productName=$data->product->name;
        if ($productName=$productRepository->findBy(['name'=>$productName])){

            return $this->json('existe déjà', 409);
        }
       
        // 3. On va récupérer la catégorie du JSON
        $categoryId = $data->category;
        $category = $categoryRepository->find($categoryId);
        // On l'associe au produit
        $product->setCategory($category);

        foreach ($data->users as $userId) {
            $user = $userRepository->find($userId);
            $product->addUser($user);
        }

        foreach ($data->localSuppliers as $localSupplierId) {
            $localSupplier = $localSupplierRepository->find($localSupplierId);
            $product->addlocalSupplier($localSupplier);
        }

        $catalog= new Catalog;
        $catalog->setUser($user);
        $catalog->setLocalSupplier($localSupplier);
        $product->addCatalog($catalog);
        
        $em = $this->getDoctrine()->getManager();
        $em->persist($product);
        $em->flush();

        return $this->json('produit ajouté', 201);
    }


    /**
     * @Route("/api/products/{id<\d+>}/edit", name="api_products_edit", methods={"POST"})
     */
    public function edit (CategoryRepository $categoryRepository, Request $request, EntityManagerInterface $em, ProductRepository $productRepository, DenormalizerInterface $denormalizer, ValidatorInterface $validator, Product $product=null )
    {   
        
        // on verifie si le produit exite en base 

        if ($product===null) {

        return $this->json('produit inexistant', 404);
        } 
        
        //on valide l'entité 
        $errors = $validator->validate($product);
        if (count($errors) !== 0) {
            $jsonErrors = [];
            foreach ($errors as $error) {
                $jsonErrors[] = [
                    'field' => $error->getPropertyPath(),
                    'message' => $error->getMessage(),
                ];
            }

            return $this->json($jsonErrors, Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $productUpdate = $productRepository->find($product->getId());
        $data = json_decode($request->getContent());

        $productUpdate->setName($data->name);
            
        $productUpdate->setUpdatedAt(new \DateTime);

        // 3. On va récupérer la catégorie du JSON
        $categoryId = $data->category;
        // on verifie qu'il est pas nul
        if (!empty($categoryId)){

        $category = $categoryRepository->find($categoryId);
        // On l'associe au produit
        $productUpdate->setCategory($category);
        }
        
        

        
        $em->flush();

        return $this->json('produit modifié',200);
       

    }
     

    
}

