import * as S from "../../../styles/styled.hero";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { LoadingComponent } from "../Loading";
import { NotFoundComponent } from "../NotFound";
import { TypographicComponent } from "../Typographic";
import { SelectHeroComponent } from "../SelectHero";
import { PaginationComponent } from "../Pagination";
import { HeaderComponent } from "../Header";
import { IContentHeroesProps } from "../../../types/result";
import { SelectOptionsComponent } from "../SelectOptions";

export default function Hero() {
  const [search, setSearch] = useState<IContentHeroesProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [itensPerPage, setItensPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(0);

  const [nameHeroes] = useState();
  const router = useRouter();
  const { name } = router.query;

  useEffect(() => {
    document.title = `Resultado: ${name} | Marvel Comics for tests!`;
  }), [];

  useEffect(() => {
    const baseURL = `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${name}&ts=1&apikey=dfdfc06935a1fe33837da6934f7b5373&hash=f5a214e5c63b897dfe0ebc1a1185c936`;
    setLoading(true);
    axios
      .get(baseURL)
      .then((response) => {
        setSearch(response?.data?.data?.results)
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.toJSON());
      });
  }, [name, nameHeroes]);

  const resultSearchTitle = () => {
    return (
      <S.Heading>
        <S.HeadingTitle>
          <TypographicComponent title="Você pesquisou: " medium />
          <TypographicComponent title={name} medium primary />
        </S.HeadingTitle>
          <SelectOptionsComponent itensPerPage={itensPerPage} setItensPerPage={setItensPerPage} />
      </S.Heading>
    );
  };

  useEffect(() => {
    setCurrentPage(0)
  }, [itensPerPage]);

  const pages = Math.ceil(search.length / itensPerPage);
  const startIndex = currentPage * itensPerPage;
  const endIndex = startIndex + itensPerPage;
  const currentItens = search.slice(startIndex, endIndex);

  return (
    <>
      <HeaderComponent />
      <div className="container">
        {resultSearchTitle()}
        {loading ? (
          <LoadingComponent />
        ) : (
          <>
            {search.length > 0 ? (
              <S.ListHero>
                {currentItens.map((item) => (
                  <SelectHeroComponent key={item.id} data={item} />
                ))}
              </S.ListHero>
            ) : (
              <NotFoundComponent />
            )}
          </>
        )}
        <PaginationComponent pages={pages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
      </div>

    </>
  );
}
